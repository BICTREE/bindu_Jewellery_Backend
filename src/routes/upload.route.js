import { uploadMultipleFileCtrl, uploadSingleFileCtrl } from "../controllers/upload.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

import { Router } from "express";
import { uploadToMemory } from "../middleware/storage.middleware.js";

export const uploadRouter = Router()

uploadRouter.use(authMiddleware)

uploadRouter.post('/single', uploadToMemory.single('file'), uploadSingleFileCtrl)
uploadRouter.post('/multiple', uploadToMemory.array('files'), uploadMultipleFileCtrl)
