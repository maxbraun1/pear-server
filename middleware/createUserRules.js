import pkg from 'express-validator';
const { body, oneOf } = pkg;

const createUserRules = [
    // first
    body("firstName", "First name required.").notEmpty(),
    body("firstName", "First name can only contain letters.").isAlpha(),
    // last
    body("lastName", "Last name required.").notEmpty(),
    body("firstName", "Last name can only contian letters.").isAlpha(),
    // username
    body("username", "Username required.").notEmpty(),
    body("username", "Username must be at least 3 characters.").isLength({ min: 3 }),
    body("username", "Username may only contain letters and numbers.").isAlphanumeric(),
    // email
    body("email", "Email required.").notEmpty(),
    body("email", "Please enter a valid email.").isEmail(),
    // password
    body("password", "Password required.").notEmpty(),
    body("password", "Password must be between 5 and 100 characters.").isLength({ min: 5, max: 100 }),
    // confirm password
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
]

export { createUserRules }

