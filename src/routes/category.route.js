import { Router } from "express";
import { validateMW } from "../middleware/validate.middleware.js";
import { categoryValidator } from "../validators/category.validator.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleChecker } from "../middleware/roleChecker.middleware.js";
import { createCategoryCtrl, getAllCategoriesCtrl, getCategoryByIdCtrl, getManyCategoriesCtrl, updateCategoryCtrl, updateCategoryStatusCtrl } from "../controllers/category.controller.js";

export const categoryRouter = Router();

categoryRouter.get('/all', authMiddleware, roleChecker(['admin']), getAllCategoriesCtrl);
categoryRouter.get('/many', getManyCategoriesCtrl);
categoryRouter.get('/:id', getCategoryByIdCtrl);

categoryRouter.use(authMiddleware)
categoryRouter.use(roleChecker(['admin']))
// admin
categoryRouter.post('/', categoryValidator.create, validateMW, createCategoryCtrl);
categoryRouter.put('/:id', categoryValidator.update, validateMW, updateCategoryCtrl);
categoryRouter.patch('/:id', updateCategoryStatusCtrl);