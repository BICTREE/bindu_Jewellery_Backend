import { body } from "express-validator";

const blogCreateValidator = [
    body("title").notEmpty().withMessage("Title is required").isString().withMessage("Title must be a string"),
    body("slug").notEmpty().withMessage("Slug is required").isString().withMessage("Slug must be a string"),
    body("content").notEmpty().withMessage("Content is required").isString().withMessage("Content must be a string"),
    body("author").notEmpty().withMessage("Author is required").isString().withMessage("Author must be a string"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
    body("tags.*").optional().isString().withMessage("Each tag must be a string"),
    body("image").optional().isObject().withMessage("Image must be an object"),
    body("image.key").if(body("image").exists()).optional().isString().withMessage("Image key must be a string"),
    body("image.location").if(body("image").exists()).optional().isString().withMessage("Image location must be a string"),
    body("publishedAt").optional().isISO8601().toDate().withMessage("publishedAt must be a date"),
];

const blogUpdateValidator = [
    body("title").optional().isString().withMessage("Title must be a string"),
    body("slug").optional().isString().withMessage("Slug must be a string"),
    body("content").optional().isString().withMessage("Content must be a string"),
    body("author").optional().isString().withMessage("Author must be a string"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
    body("tags.*").optional().isString().withMessage("Each tag must be a string"),
    body("image").optional().isObject().withMessage("Image must be an object"),
    body("image.key").if(body("image").exists()).optional().isString().withMessage("Image key must be a string"),
    body("image.location").if(body("image").exists()).optional().isString().withMessage("Image location must be a string"),
    body("publishedAt").optional().isISO8601().toDate().withMessage("publishedAt must be a date"),
];

const blogStatusValidator = [
    body("status").notEmpty().withMessage("Status is required").isIn(["archived", "unarchived"]).withMessage("Status must be 'archived' or 'unarchived'")
]

export { blogCreateValidator, blogUpdateValidator, blogStatusValidator };


