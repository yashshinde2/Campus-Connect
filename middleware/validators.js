const { body } = require('express-validator');

exports.signupValidation = [
    body('name').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid institutional email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    body('course').notEmpty().withMessage('Course is required'),
    body('department').notEmpty().withMessage('Department is required')
];

exports.loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

exports.noticeValidation = [
    body('title').trim().notEmpty().withMessage('Notice title is required'),
    body('description').trim().notEmpty().withMessage('Notice description is required'),
    body('category').notEmpty().withMessage('Category is required')
];

exports.eventValidation = [
    body('title').trim().notEmpty().withMessage('Event title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('venue').notEmpty().withMessage('Venue is required')
];

exports.resourceValidation = [
    body('title').trim().notEmpty().withMessage('Resource title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('semester').isInt({ min: 1, max: 10 }).withMessage('Valid semester is required'),
    body('type').notEmpty().withMessage('Resource type is required')
];
