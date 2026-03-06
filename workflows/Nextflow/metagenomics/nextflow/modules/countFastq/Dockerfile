# syntax=docker/dockerfile:1
FROM continuumio/miniconda3:v25.11.1 AS build
ENV version=0.3.1
ENV container=docker

# add conda channels
RUN conda config --add channels conda-forge \
    && conda config --add channels bioconda

RUN conda init bash \
    && . ~/.bashrc \
    && conda create --name countFastq \
    && conda activate countFastq 

RUN conda install -n countFastq -c conda-forge perl=5.32.1

RUN conda install -c conda-forge conda-pack=0.8.1

#pack environment for runtime image
RUN conda-pack -n countFastq -o /tmp/env.tar && \
    mkdir /venv && cd /venv && tar xf /tmp/env.tar && \
    rm /tmp/env.tar

RUN /venv/bin/conda-unpack

FROM debian:trixie AS runtime

COPY --from=build /venv /venv

ENV PATH=/venv/bin:$PATH
RUN apt-get update && apt-get install procps -y && apt-get clean

SHELL ["/bin/bash", "-c"]
CMD /bin/bash
