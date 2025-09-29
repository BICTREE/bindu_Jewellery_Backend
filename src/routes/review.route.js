import {
    createReviewCtrl, deleteReviewCtrl, getAllReviewsCtrl,
    getManyReviewsCtrl, getReviewByIdCtrl, updateReviewCtrl,
    updateReviewStatusCtrl
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleChecker } from "../middleware/roleChecker.middleware.js";
import { reviewValidator } from "../validators/review.validator.js";
import { ownerChecker } from "../middleware/ownerChecker.middleware.js";
import { Router } from "express";
import { validateMW } from "../middleware/validate.middleware.js";

const reviewRouter = Router();

reviewRouter.get('/all', authMiddleware, roleChecker(["admin"]), getAllReviewsCtrl);
reviewRouter.get('/many', getManyReviewsCtrl);
reviewRouter.get('/:id', getReviewByIdCtrl);

reviewRouter.use(authMiddleware)

reviewRouter.post('', reviewValidator.create, validateMW, ownerChecker("body", "userId"), createReviewCtrl);
reviewRouter.put('/:id', reviewValidator.update, validateMW, updateReviewCtrl);
reviewRouter.delete('/:id', deleteReviewCtrl);
reviewRouter.patch('/:id', updateReviewStatusCtrl)

export { reviewRouter };