import { Blog } from "../models/blog.model.js";

export const createBlog = async (obj) => {
    return await Blog.create(obj)
}

export const getBlogById = async (id) => {
    return await Blog.findOne({ _id: id})
}

export const getManyBlogs = async (filters = {}) => {
    const query = { ...filters, isArchived: false };
    return await Blog.find(query).sort({ createdAt: -1 })
}

export const getAllBlogs = async (filters = {}) => {
    return await Blog.find(filters).sort({ createdAt: -1 })
}

export const updateBlog = async (id, obj = {}) => {
    return await Blog.findOneAndUpdate(
        { _id: id, isArchived: false },
        { $set: obj },
        { new: true }
    )
}

export const deleteBlog = async (id) => {
    return await Blog.findOneAndUpdate(
        { _id: id, isArchived: false },
        { $set: { isArchived: true } },
        { new: true }
    )
}

export const hardDeleteBlog = async (id) => {
    return await Blog.findByIdAndDelete(id)
}

export const restoreBlog = async (id) => {
    return await Blog.findOneAndUpdate(
        { _id: id, isArchived: true },
        { $set: { isArchived: false } },
        { new: true }
    )
}

export const updateBlogStatus = async (id, isArchived) => {
    return await Blog.findByIdAndUpdate(id, { $set: { isArchived } }, { new: true })
}

export const searchBlogs = async (searchTerm) => {
    return await Blog.find({
        $or: [
            { title: new RegExp(searchTerm, 'i') },
            { content: new RegExp(searchTerm, 'i') },
            { tags: { $in: [new RegExp(searchTerm, 'i')] } },
            { author: new RegExp(searchTerm, 'i') },
        ],
        isArchived: false
    }).sort({ createdAt: -1 })
}

export const getBlogBySlug = async (slug) => {
    return await Blog.findOne({ slug, isArchived: false })
}

