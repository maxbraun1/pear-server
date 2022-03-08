import pkg from 'express-validator';
const { body } = pkg;

const createPostRules = [
    // Title
    body("title", "Title required.").notEmpty(),
    // Description
    body("description", "Description required.").notEmpty(),
    // Technologies
    body("technologies", "Technologies must be an array.").isArray(),
    // Category
    body("category", "Category must be alphanumeric.").isAlphanumeric(),
    body("category", "Category required.").notEmpty(),
]

export { createPostRules }

