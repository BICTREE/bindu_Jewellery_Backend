import { body } from "express-validator";

const mediaItemValidator = [
    body("media.*.filetype")
        .notEmpty()
        .withMessage("Filetype is required for each media item")
        .isIn(["image", "video", "youtube"])
        .withMessage("Filetype must be 'image', 'video', or 'youtube'"),
    
    body("media.*.title")
        .notEmpty()
        .withMessage("Title is required for each media item")
        .isString()
        .withMessage("Title must be a string"),
    
    body("media.*.description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    
    body("media.*.tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array"),
    
    body("media.*.file")
        .optional()
        .isObject()
        .withMessage("File must be an object"),
    
    body("media.*.file.key")
        .if(body("media.*.file").exists())
        .optional()
        .isString()
        .withMessage("File key must be a string"),
    
    body("media.*.file.location")
        .if(body("media.*.file").exists())
        .optional()
        .isString()
        .withMessage("File location must be a string"),
    
    body("media.*.youtubeLink")
        .if(body("media.*.filetype").equals("youtube"))
        .notEmpty()
        .withMessage("YouTube link is required when filetype is youtube")
        .isURL()
        .withMessage("YouTube link must be a valid URL"),
];

const mediaGroupCreateValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
    
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    
    body("order")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Order must be a non-negative integer"),
    
    body("media")
        .optional()
        .isArray()
        .withMessage("Media must be an array"),
    
    ...mediaItemValidator
];

const mediaGroupUpdateValidator = [
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string"),
    
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    
    body("order")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Order must be a non-negative integer"),
];

const mediaGroupStatusValidator = [
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["archived", "unarchived"])
        .withMessage("Status must be 'archived' or 'unarchived'")
];

export { mediaGroupCreateValidator, mediaGroupUpdateValidator, mediaGroupStatusValidator };
