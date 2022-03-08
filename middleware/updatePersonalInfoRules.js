import pkg from 'express-validator';
const { body } = pkg;

const updatePersonalInfoRules = [
    // first
    body("firstName", "First name required.").notEmpty(),
    body("firstName", "First name can only contain letters.").isAlpha(),
    // last
    body("lastName", "Last name required.").notEmpty(),
    body("lastName", "Last name can only contian letters.").isAlpha()
]

export { updatePersonalInfoRules }