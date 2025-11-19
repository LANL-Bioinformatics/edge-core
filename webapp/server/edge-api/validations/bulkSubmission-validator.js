const { body, validationResult } = require('express-validator')

const validationRules = () => [
  body('bulkSubmission.name')
    .trim()
    .isLength({ min: 3, max: 30 })
    .escape()
    .withMessage(
      'Invalid bulkSubmission name, at least 3 but less than 30 characters.'
    ),
  body('bulkSubmission.desc').optional()
]

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  const resultErrors = {
    error: {},
    message: 'Validation failed',
    success: false
  }
  errors.array().forEach(err => {
    resultErrors.error[err.param] = err.msg
  })
  return res.status(400).json(resultErrors)
}

module.exports = {
  validationRules,
  validate
}
