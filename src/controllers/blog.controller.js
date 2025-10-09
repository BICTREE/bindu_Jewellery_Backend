import { isValidObjectId } from "mongoose";
import {
    createBlog,
    updateBlog,
    getBlogById,
    getManyBlogs,
    deleteBlog,
    hardDeleteBlog,
    restoreBlog,
    updateBlogStatus,
    searchBlogs,
    getAllBlogs,
    getBlogBySlug
} from "../services/blog.service.js";

export const createBlogCtrl = async (req, res) => {
    try {
        const createObj = req.body;
        const blog = await createBlog(createObj);
        if (!blog) throw new Error('FAILED');
        return res.status(201).json({ success: true, message: 'success', data: { blog }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getBlogByIdCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid Id', data: null, error: 'BAD_REQUEST' })
        const blog = await getBlogById(id);
        if (!blog) return res.status(404).json({ success: false, message: 'Not Found', data: null, error: 'NOT_FOUND' })
        return res.status(200).json({ success: true, message: 'success', data: { blog }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getBlogBySlugCtrl = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await getBlogBySlug(slug);
        if (!blog) return res.status(404).json({ success: false, message: 'Not Found', data: null, error: 'NOT_FOUND' })
        return res.status(200).json({ success: true, message: 'success', data: { blog }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getManyBlogsCtrl = async (req, res) => {
    try {
        let { page, entries } = req.query; page = parseInt(page); entries = parseInt(entries);
        const { search, tag, author } = req.query;
        const filters = {};
        if (tag?.trim()) filters.tags = { $in: [new RegExp(tag.trim(), 'i')] };
        if (author?.trim()) filters.author = new RegExp(author.trim(), 'i');
        if (search?.trim()) {
            filters.$or = [
                { title: new RegExp(search, 'i') },
                { content: new RegExp(search, 'i') },
                { tags: { $in: [new RegExp(search, 'i')] } },
                { author: new RegExp(search, 'i') },
            ]
        }
        let result = await getManyBlogs(filters);
        if (page && entries) result = result.slice((page - 1) * entries, page * entries)
        return res.status(200).json({ success: true, message: 'success', data: { result }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getAllBlogsCtrl = async (req, res) => {
    try {
        let { page, entries } = req.query; page = parseInt(page); entries = parseInt(entries);
        const { search, tag, author } = req.query;
        const filters = {};
        if (tag?.trim()) filters.tags = { $in: [new RegExp(tag.trim(), 'i')] };
        if (author?.trim()) filters.author = new RegExp(author.trim(), 'i');
        if (search?.trim()) {
            filters.$or = [
                { title: new RegExp(search, 'i') },
                { content: new RegExp(search, 'i') },
                { tags: { $in: [new RegExp(search, 'i')] } },
                { author: new RegExp(search, 'i') },
            ]
        }
        let result = await getAllBlogs(filters);
        if (page && entries) result = result.slice((page - 1) * entries, page * entries)
        return res.status(200).json({ success: true, message: 'success', data: { result }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const updateBlogCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid Id', data: null, error: 'BAD_REQUEST' })
        const blog = await updateBlog(id, req.body);
        if (!blog) throw new Error('FAILED')
        return res.status(200).json({ success: true, message: 'success', data: { blog }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const updateBlogStatusCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid Id', data: null, error: 'BAD_REQUEST' })
        const { status } = req.body;
        if (!['archived', 'unarchived']?.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status', data: null, error: 'BAD_REQUEST' })
        const isArchived = status === 'archived';
        const blog = await updateBlogStatus(id, isArchived);
        if (!blog) throw new Error('FAILED');
        return res.status(200).json({ success: true, message: 'success', data: { blog }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const deleteBlogCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid Id', data: null, error: 'BAD_REQUEST' })
        const blog = await deleteBlog(id);
        if (!blog) return res.status(404).json({ success: false, message: 'Not Found', data: null, error: 'NOT_FOUND' })
        return res.status(200).json({ success: true, message: 'Blog archived', data: null, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const restoreBlogCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid Id', data: null, error: 'BAD_REQUEST' })
        const blog = await restoreBlog(id);
        if (!blog) return res.status(404).json({ success: false, message: 'Not Found', data: null, error: 'NOT_FOUND' })
        return res.status(200).json({ success: true, message: 'Blog restored', data: { blog }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const hardDeleteBlogCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid Id', data: null, error: 'BAD_REQUEST' })
        const blog = await hardDeleteBlog(id);
        if (!blog) return res.status(404).json({ success: false, message: 'Not Found', data: null, error: 'NOT_FOUND' })
        return res.status(200).json({ success: true, message: 'Blog permanently deleted', data: null, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}


