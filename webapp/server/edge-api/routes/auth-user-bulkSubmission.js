const router = require('express').Router()
const {
  validationRules: bulkSubmissionCodeValidationRules,
  validate: bulkSubmissionCodeValidate,
} = require('../validations/bulkSubmission-code-validator')
const {
  validationRules: addValidationRules,
  validate: addValidate,
} = require('../validations/bulkSubmission-validator')
const {
  validationRules: updateValidationRules,
  validate: updateValidate,
} = require('../validations/bulkSubmission-update-validator')
const {
  addOne,
  getOne,
  updateOne,
  getConf,
  getOwn,
  getAll,
  getQueue,
  getFiles,
  getOutputs,
  getBatchOutputs,
  getResult,
  getRunStats,
  getBulkSubmissionsByType,
} = require('../controllers/auth-user-bulkSubmission-controller')

/**
 * @swagger
 * /api/auth-user/bulkSubmissions:
 *   get:
 *     summary: List bulkSubmissions owned by user
 *     tags: [AuthUser]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionSuccessful'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionFailed'
 *       500:
 *         description: API server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/serverError'
 */
router.get('/bulkSubmissions', async (req, res) => {
  await getOwn(req, res)
})

/**
 * @swagger
 * /api/auth-user/bulkSubmissions/all:
 *   get:
 *     summary: List bulkSubmissions that user can access to
 *     tags: [AuthUser]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionSuccessful'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionFailed'
 *       500:
 *         description: API server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/serverError'
 */
router.get('/bulkSubmissions/all', async (req, res) => {
  await getAll(req, res)
})

/**
 * @swagger
 * /api/auth-user/bulkSubmissions/queue:
 *   get:
 *     summary: List bulkSubmissions that are still running or in queue
 *     tags: [AuthUser]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionSuccessful'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionFailed'
 *       500:
 *         description: API server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/serverError'
 */
router.get('/bulkSubmissions/queue', async (req, res) => {
  await getQueue(req, res)
})

/**
 * @swagger
 * /api/auth-user/bulkSubmissions/files:
 *   post:
 *     summary: Find all files matching fileTypes in bulkSubmission directories
 *     tags: [AuthUser]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/models/bulkSubmissionFiles'
 *     responses:
 *       200:
 *         description: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionSuccessful'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionFailed'
 *       500:
 *         description: API server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/serverError'
 */
router.post('/bulkSubmissions/files', async (req, res) => {
  await getFiles(req, res)
})

/**
 * @swagger
 * /api/auth-user/bulkSubmissions:
 *   post:
 *     summary: Create new bulkSubmission
 *     tags: [AuthUser]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/models/addBulkSubmission'
 *     responses:
 *       200:
 *         description: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionSuccessful'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionFailed'
 *       500:
 *         description: API server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/serverError'
 */
router.post(
  '/bulkSubmissions',
  addValidationRules(),
  addValidate,
  async (req, res) => {
    await addOne(req, res)
  },
)

/**
 * @swagger
 * /api/auth-user/bulkSubmissions/{code}:
 *   put:
 *     summary: Update bulkSubmission
 *     tags: [AuthUser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        type: string
 *        value: test
 *        description: The bulkSubmission unique code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/models/updateBulkSubmission'
 *     responses:
 *       200:
 *         description: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionSuccessful'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionFailed'
 *       500:
 *         description: API server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/serverError'
 */
router.put(
  '/bulkSubmissions/:code',
  updateValidationRules(),
  updateValidate,
  async (req, res) => {
    await updateOne(req, res)
  },
)

/**
 * @swagger
 * /api/auth-user/bulkSubmissions/{code}:
 *   get:
 *     summary: Get a bulkSubmission by code
 *     tags: [AuthUser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        type: string
 *        value: test
 *        description: The bulkSubmission unique code.
 *     responses:
 *       200:
 *         description: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/bulkSubmissionActionSuccessful'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionFailed'
 *       500:
 *         description: API server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/serverError'
 */
router.get(
  '/bulkSubmissions/:code',
  bulkSubmissionCodeValidationRules(),
  bulkSubmissionCodeValidate,
  async (req, res) => {
    await getOne(req, res)
  },
)

/**
 * @swagger
 * /api/auth-user/bulkSubmissions/type/{type}:
 *   get:
 *     summary: Get bulkSubmissions by type
 *     tags: [AuthUser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: type
 *        required: true
 *        type: string
 *        value: test
 *        description: The bulkSubmission type.
 *     responses:
 *       200:
 *         description: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/bulkSubmissionActionSuccessful'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionFailed'
 *       500:
 *         description: API server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/serverError'
 */
router.get('/bulkSubmissions/type/:type', async (req, res) => {
  await getBulkSubmissionsByType(req, res)
})

/**
 * @swagger
 * /api/auth-user/bulkSubmissions/{code}/conf:
 *   get:
 *     summary: Get a bulkSubmission configuration by code
 *     tags: [AuthUser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        type: string
 *        value: test
 *        description: The bulkSubmission unique code.
 *     responses:
 *       200:
 *         description: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionSuccessful'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionFailed'
 *       500:
 *         description: API server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/serverError'
 */
router.get(
  '/bulkSubmissions/:code/conf',
  bulkSubmissionCodeValidationRules(),
  bulkSubmissionCodeValidate,
  async (req, res) => {
    await getConf(req, res)
  },
)

/**
 * @swagger
 * /api/auth-user/bulkSubmissions/{code}/outputs:
 *   get:
 *     summary: Get output files by code
 *     tags: [AuthUser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        type: string
 *        value: test
 *        description: The bulkSubmission unique code.
 *     responses:
 *       200:
 *         description: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionSuccessful'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionFailed'
 *       500:
 *         description: API server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/serverError'
 */
router.get(
  '/bulkSubmissions/:code/outputs',
  bulkSubmissionCodeValidationRules(),
  bulkSubmissionCodeValidate,
  async (req, res) => {
    await getOutputs(req, res)
  },
)

/**
 * @swagger
 * /api/auth-user/bulkSubmissions/{code}/batch/outputs:
 *   get:
 *     summary: Get output files by code
 *     tags: [AuthUser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        type: string
 *        value: test
 *        description: The bulkSubmission unique code.
 *     responses:
 *       200:
 *         description: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionSuccessful'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionFailed'
 *       500:
 *         description: API server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/serverError'
 */

router.get(
  '/bulkSubmissions/:code/batch/outputs',
  bulkSubmissionCodeValidationRules(),
  bulkSubmissionCodeValidate,
  async (req, res) => {
    await getBatchOutputs(req, res)
  },
)

/**
 * @swagger
 * /api/auth-user/bulkSubmissions/{code}/result:
 *   get:
 *     summary: Get bulkSubmission result by code
 *     tags: [AuthUser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        type: string
 *        value: test
 *        description: The bulkSubmission unique code.
 *     responses:
 *       200:
 *         description: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionSuccessful'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionFailed'
 *       500:
 *         description: API server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/serverError'
 */
router.get(
  '/bulkSubmissions/:code/result',
  bulkSubmissionCodeValidationRules(),
  bulkSubmissionCodeValidate,
  async (req, res) => {
    await getResult(req, res)
  },
)

/**
 * @swagger
 * /api/auth-user/bulkSubmissions/{code}/runStats:
 *   get:
 *     summary: Get bulkSubmission runStats by code
 *     tags: [AuthUser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        type: string
 *        value: test
 *        description: The bulkSubmission unique code.
 *     responses:
 *       200:
 *         description: Action successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionSuccessful'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/actionFailed'
 *       500:
 *         description: API server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/serverError'
 */
router.get(
  '/bulkSubmissions/:code/runStats',
  bulkSubmissionCodeValidationRules(),
  bulkSubmissionCodeValidate,
  async (req, res) => {
    await getRunStats(req, res)
  },
)

module.exports = router
