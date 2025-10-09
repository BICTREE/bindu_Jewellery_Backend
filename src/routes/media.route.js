import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleChecker } from "../middleware/roleChecker.middleware.js";
import { mediaCreateValidator, mediaUpdateValidator, mediaStatusValidator } from "../validators/media.validator.js";
import { validateMW } from "../middleware/validate.middleware.js";
import { 
    createMediaCtrl, 
    deleteMediaCtrl, 
    getMediaByIdCtrl, 
    getManyMediaCtrl, 
    updateMediaCtrl,
    getMediaByTypeCtrl,
    searchMediaCtrl,
    getDeletedMediaCtrl,
    restoreMediaCtrl,
    hardDeleteMediaCtrl,
    updateMediaStatusCtrl
} from "../controllers/media.controller.js";

const mediaRouter = Router();

// Public routes
mediaRouter.get('', getManyMediaCtrl);
mediaRouter.get('/search', searchMediaCtrl);
mediaRouter.get('/type/:filetype', getMediaByTypeCtrl);

// Protected routes (require authentication and admin role)
mediaRouter.use(authMiddleware)
mediaRouter.use(roleChecker(['admin']))

// Specific admin list MUST be before id route to avoid matching 'all' as :id
mediaRouter.get('/all', getDeletedMediaCtrl); // Get all media (admin)

mediaRouter.post('', mediaCreateValidator, validateMW, createMediaCtrl);
mediaRouter.put('/:id', mediaUpdateValidator, validateMW, updateMediaCtrl);
mediaRouter.patch('/:id', mediaStatusValidator, validateMW, updateMediaStatusCtrl);
mediaRouter.delete('/:id', deleteMediaCtrl); // Soft delete (archived)
mediaRouter.delete('/:id/hard', hardDeleteMediaCtrl); // Hard delete (permanent)
mediaRouter.patch('/:id/restore', restoreMediaCtrl); // Restore soft deleted media

// Keep public id route last among public
mediaRouter.get('/:id', getMediaByIdCtrl);

export { mediaRouter };
