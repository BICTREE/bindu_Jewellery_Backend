import { body } from "express-validator";

const mediaCreateValidator = [
    body("filetype")
        .notEmpty()
        .withMessage("Filetype is required")
        .isIn(["image", "video", "youtube"])
        .withMessage("Filetype must be 'image', 'video', or 'youtube'"),
    
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .withMessage("Title must be a string"),
    
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    
    body("tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array"),
    
    body("tags.*")
        .optional()
        .isString()
        .withMessage("Each tag must be a string"),
    
    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean"),
    
    body("file")
        .optional()
        .isObject()
        .withMessage("File must be an object"),
    
    body("file.name")
        .if(body("file").exists())
        .optional()
        .isString()
        .withMessage("File name must be a string"),
    
    body("file.key")
        .if(body("file").exists())
        .optional()
        .isString()
        .withMessage("File key must be a string"),
    
    body("file.location")
        .if(body("file").exists())
        .optional()
        .isString()
        .withMessage("File location must be a string"),
    
    body("youtubeLink")
        .if(body("filetype").equals("youtube"))
        .notEmpty()
        .withMessage("YouTube link is required when filetype is youtube")
        .isURL()
        .withMessage("YouTube link must be a valid URL")
        .custom((value) => {
            // Basic YouTube URL validation
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/;
            if (!youtubeRegex.test(value)) {
                throw new Error("Must be a valid YouTube URL");
            }
            return true;
        }),
    
    // Validate that file is provided for image and video types
    body("file")
        .if(body("filetype").isIn(["image", "video"]))
        .notEmpty()
        .withMessage("File is required for image and video types"),
    
    body("file.key")
        .if(body("filetype").isIn(["image", "video"]))
        .notEmpty()
        .withMessage("File key is required for image and video types"),
    
    body("file.location")
        .if(body("filetype").isIn(["image", "video"]))
        .notEmpty()
        .withMessage("File location is required for image and video types"),
];

const mediaUpdateValidator = [
    body("filetype")
        .optional()
        .isIn(["image", "video", "youtube"])
        .withMessage("Filetype must be 'image', 'video', or 'youtube'"),
    
    body("title")
        .optional()
        .isString()
        .withMessage("Title must be a string"),
    
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    
    body("tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array"),
    
    body("tags.*")
        .optional()
        .isString()
        .withMessage("Each tag must be a string"),
    
    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean"),
    
    body("file")
        .optional()
        .isObject()
        .withMessage("File must be an object"),
    
    body("file.name")
        .if(body("file").exists())
        .optional()
        .isString()
        .withMessage("File name must be a string"),
    
    body("file.key")
        .if(body("file").exists())
        .optional()
        .isString()
        .withMessage("File key must be a string"),
    
    body("file.location")
        .if(body("file").exists())
        .optional()
        .isString()
        .withMessage("File location must be a string"),
    
    body("youtubeLink")
        .optional()
        .isURL()
        .withMessage("YouTube link must be a valid URL")
        .custom((value, { req }) => {
            if (value && req.body.filetype === "youtube") {
                // Basic YouTube URL validation
                const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/;
                if (!youtubeRegex.test(value)) {
                    throw new Error("Must be a valid YouTube URL");
                }
            }
            return true;
        }),
];

export { mediaCreateValidator, mediaUpdateValidator };
// add validator for status update similar to category
const mediaStatusValidator = [
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["archived", "unarchived"]) 
        .withMessage("Status must be 'archived' or 'unarchived'")
];

export { mediaStatusValidator };
