import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleChecker } from "../middleware/roleChecker.middleware.js";
import { validateMW } from "../middleware/validate.middleware.js";
import { blogCreateValidator, blogStatusValidator, blogUpdateValidator } from "../validators/blog.validator.js";
import {
    createBlogCtrl,
    deleteBlogCtrl,
    getBlogByIdCtrl,
    getManyBlogsCtrl,
    updateBlogCtrl,
    getAllBlogsCtrl,
    restoreBlogCtrl,
    hardDeleteBlogCtrl,
    updateBlogStatusCtrl,
    getBlogBySlugCtrl
} from "../controllers/blog.controller.js";

const blogRouter = Router();

// Public
blogRouter.get('', getManyBlogsCtrl);
blogRouter.get('/slug/:slug', getBlogBySlugCtrl);

// Admin
blogRouter.use(authMiddleware)
blogRouter.use(roleChecker(['admin']))
blogRouter.get('/all', getAllBlogsCtrl);
blogRouter.post('', blogCreateValidator, validateMW, createBlogCtrl);
blogRouter.put('/:id', blogUpdateValidator, validateMW, updateBlogCtrl);
blogRouter.patch('/:id', blogStatusValidator, validateMW, updateBlogStatusCtrl);
blogRouter.delete('/:id', deleteBlogCtrl);
blogRouter.patch('/:id/restore', restoreBlogCtrl);
blogRouter.delete('/:id/hard', hardDeleteBlogCtrl);
blogRouter.get('/:id', getBlogByIdCtrl);

export { blogRouter };


