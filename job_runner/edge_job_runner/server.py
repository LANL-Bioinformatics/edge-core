"""The HTTP job API.

Endpoints:

* ``GET    /health``          -- liveness, unauthenticated
* ``POST   /v1/jobs``         -- submit (idempotent)
* ``GET    /v1/jobs/<jobId>`` -- poll
* ``DELETE /v1/jobs/<jobId>`` -- cancel
"""

from __future__ import annotations

import hmac
import json
import re
import signal
import threading
import uuid
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import urlparse

from .errors import RequestError
from .executor import JobExecutor
from .store import JobStore
from .tooling import JOB_ID_PATTERN, PROJECT_ID_PATTERN, ToolDefinition

# Bounds the request body so a malformed Content-Length cannot exhaust memory.
MAX_REQUEST_BYTES = 1024 * 1024


class JobRunnerServer(ThreadingHTTPServer):
    """Threading HTTP server carrying the runner's collaborators."""

    daemon_threads = True

    def __init__(
        self,
        address: tuple[str, int],
        store: JobStore,
        executor: JobExecutor,
        tool: ToolDefinition,
        api_token: str,
    ):
        super().__init__(address, JobRequestHandler)
        self.store = store
        self.executor = executor
        self.tool = tool
        self.api_token = api_token


class JobRequestHandler(BaseHTTPRequestHandler):
    """Request handler for the job API."""

    server: JobRunnerServer

    def log_message(self, message_format: str, *args: Any) -> None:
        print(f"[job-runner] {self.address_string()} {message_format % args}")

    def _json(self, status: HTTPStatus, body: dict[str, Any]) -> None:
        encoded = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def _authorized(self) -> bool:
        """Check the bearer token.

        An unset token disables auth, for single-host deployments where the
        runner is not reachable off-box. Comparison is constant-time to avoid
        leaking the token through response timing.
        """
        if not self.server.api_token:
            return True
        return hmac.compare_digest(
            self.headers.get("Authorization", ""),
            f"Bearer {self.server.api_token}",
        )

    def _require_authorization(self) -> bool:
        if self._authorized():
            return True
        self._json(HTTPStatus.UNAUTHORIZED, {"error": "Unauthorized"})
        return False

    def _job_id(self) -> str | None:
        match = re.fullmatch(r"/v1/jobs/([^/]+)", urlparse(self.path).path)
        return match.group(1) if match else None

    def do_GET(self) -> None:  # noqa: N802 - BaseHTTPRequestHandler API
        path = urlparse(self.path).path
        # Unauthenticated so container health checks need no credentials.
        if path == "/health":
            self._json(HTTPStatus.OK, {"status": "ok", "tool": self.server.tool.name})
            return
        if not self._require_authorization():
            return
        job_id = self._job_id()
        if job_id is None:
            self._json(HTTPStatus.NOT_FOUND, {"error": "Not found"})
            return
        job = self.server.store.get_job(job_id)
        if job is None:
            self._json(HTTPStatus.NOT_FOUND, {"error": "Job not found"})
            return
        self._json(HTTPStatus.OK, job)

    def do_POST(self) -> None:  # noqa: N802 - BaseHTTPRequestHandler API
        if urlparse(self.path).path != "/v1/jobs":
            self._json(HTTPStatus.NOT_FOUND, {"error": "Not found"})
            return
        if not self._require_authorization():
            return
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            if content_length <= 0 or content_length > MAX_REQUEST_BYTES:
                raise RequestError("Request body is empty or too large")
            request = json.loads(self.rfile.read(content_length))
            project_id = request.get("projectId")
            if not isinstance(project_id, str) or not PROJECT_ID_PATTERN.fullmatch(
                project_id
            ):
                raise RequestError("projectId is invalid")
            job_id = request.get("jobId") or str(uuid.uuid4())
            if not isinstance(job_id, str) or not JOB_ID_PATTERN.fullmatch(job_id):
                raise RequestError("jobId is invalid")
            payload = request.get("input")
            if not isinstance(payload, dict):
                raise RequestError("input must be an object")
            payload = self.server.tool.validate_auxiliary_paths(payload)
            command = self.server.tool.build_command(payload)
            # Default the key to the job id so a caller that omits the header
            # still gets replay protection.
            idempotency_key = self.headers.get("Idempotency-Key", job_id).strip()
            if not idempotency_key or len(idempotency_key) > 256:
                raise RequestError("Idempotency-Key is invalid")
            job, created = self.server.store.create_job(
                job_id,
                idempotency_key,
                project_id,
                self.server.tool.name,
                payload,
                command,
            )
            # 202 for a new job, 200 for a replay, so callers can tell them apart.
            self._json(HTTPStatus.ACCEPTED if created else HTTPStatus.OK, job)
        except (json.JSONDecodeError, RequestError, TypeError) as error:
            # 4xx: the webapp treats these as permanent and fails the job.
            self._json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
        except Exception as error:  # noqa: BLE001 - keep the API process alive
            # 5xx: the webapp retries these, so never leak details here.
            self.log_error("Job submission failed: %s", error)
            self._json(
                HTTPStatus.INTERNAL_SERVER_ERROR,
                {"error": "Internal job-runner error"},
            )

    def do_DELETE(self) -> None:  # noqa: N802 - BaseHTTPRequestHandler API
        if not self._require_authorization():
            return
        job_id = self._job_id()
        if job_id is None:
            self._json(HTTPStatus.NOT_FOUND, {"error": "Not found"})
            return
        job = self.server.executor.cancel(job_id)
        if job is None:
            self._json(HTTPStatus.NOT_FOUND, {"error": "Job not found"})
            return
        self._json(HTTPStatus.ACCEPTED, job)


def serve(
    host: str,
    port: int,
    store: JobStore,
    executor: JobExecutor,
    tool: ToolDefinition,
    api_token: str,
) -> None:
    """Run the API until SIGTERM or SIGINT, then shut down cleanly."""
    server = JobRunnerServer((host, port), store, executor, tool, api_token)
    executor.start()

    def stop_server(_signum: int, _frame: Any) -> None:
        executor.stop()
        # shutdown() blocks until serve_forever returns, so it cannot be called
        # from the signal handler itself.
        threading.Thread(target=server.shutdown, daemon=True).start()

    signal.signal(signal.SIGTERM, stop_server)
    signal.signal(signal.SIGINT, stop_server)
    print(f"[job-runner] {tool.name} runner listening on {host}:{port}")
    try:
        server.serve_forever(poll_interval=0.5)
    finally:
        executor.stop()
        server.server_close()
