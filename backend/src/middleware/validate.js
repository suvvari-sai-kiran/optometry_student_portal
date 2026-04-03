const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/).withMessage('Password must contain one uppercase letter, one number, and one symbol'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};

module.exports = { registerValidation, loginValidation, validate };
