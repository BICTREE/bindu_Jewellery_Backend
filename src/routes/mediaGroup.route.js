import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleChecker } from "../middleware/roleChecker.middleware.js";
import { validateMW } from "../middleware/validate.middleware.js";
import { mediaGroupCreateValidator, mediaGroupUpdateValidator, mediaGroupStatusValidator } from "../validators/mediaGroup.validator.js";
import {
    createMediaGroupCtrl,
    deleteMediaGroupCtrl,
    getMediaGroupByIdCtrl,
    getManyMediaGroupsCtrl,
    updateMediaGroupCtrl,
    getAllMediaGroupsCtrl,
    restoreMediaGroupCtrl,
    updateMediaGroupStatusCtrl,
    addMediaToGroupCtrl,
    removeMediaFromGroupCtrl,
    hardDeleteMediaGroupCtrl
} from "../controllers/mediaGroup.controller.js";

const mediaGroupRouter = Router();

// Public routes
mediaGroupRouter.get('', getManyMediaGroupsCtrl);
mediaGroupRouter.get('/:id', getMediaGroupByIdCtrl);

// Protected routes (require authentication and admin role)
mediaGroupRouter.use(authMiddleware)
mediaGroupRouter.use(roleChecker(['admin']))

mediaGroupRouter.post('', mediaGroupCreateValidator, validateMW, createMediaGroupCtrl);
mediaGroupRouter.put('/:id', mediaGroupUpdateValidator, validateMW, updateMediaGroupCtrl);
mediaGroupRouter.patch('/:id', mediaGroupStatusValidator, validateMW, updateMediaGroupStatusCtrl);
mediaGroupRouter.post('/:id/media', addMediaToGroupCtrl);
mediaGroupRouter.delete('/:id/media/:mediaItemId', removeMediaFromGroupCtrl);
mediaGroupRouter.delete('/:id', deleteMediaGroupCtrl);
mediaGroupRouter.delete('/:id/hard', hardDeleteMediaGroupCtrl);
mediaGroupRouter.patch('/:id/restore', restoreMediaGroupCtrl);
mediaGroupRouter.get('/admin/all', getAllMediaGroupsCtrl);

export { mediaGroupRouter };
