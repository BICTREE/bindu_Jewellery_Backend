import { Media } from "../models/media.model.js";

export const createMedia = async (obj) => {
    return await Media.create(obj)
}

export const getMediaById = async (id) => {
    return await Media.findOne({ _id: id, isArchived: false })
}

export const getManyMedia = async (filters) => {
    // Exclude soft deleted records by default
    const query = { ...filters, isArchived: false };
    return await Media.find(query).sort({ createdAt: -1 })
}

export const updateMedia = async (id, obj) => {
    return await Media.findOneAndUpdate(
        { _id: id, isArchived: false }, 
        { $set: obj }, 
        { new: true }
    )
}

export const updateMediaStatus = async (id, isArchived) => {
    return await Media.findByIdAndUpdate(
        id,
        { $set: { isArchived } },
        { new: true }
    )
}

export const deleteMedia = async (id) => {
    return await Media.findOneAndUpdate(
        { _id: id, isArchived: false },
        { $set: { isArchived: true } },
        { new: true }
    )
}

export const getMediaByType = async (filetype) => {
    return await Media.find({ filetype, isArchived: false }).sort({ createdAt: -1 })
}

export const searchMedia = async (searchTerm) => {
    return await Media.find({
        $or: [
            { title: new RegExp(searchTerm, 'i') },
            { description: new RegExp(searchTerm, 'i') },
            { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ],
        isArchived: false
    }).sort({ createdAt: -1 })
}

// New methods for soft delete functionality
export const getDeletedMedia = async (filters = {}) => {
    const query = { ...filters, isArchived: true };
    return await Media.find(query).sort({ updatedAt: -1 })
}

export const getAllMedia = async (filters = {}) => {
    return await Media.find(filters).sort({ createdAt: -1 })
}

export const restoreMedia = async (id) => {
    return await Media.findOneAndUpdate(
        { _id: id, isArchived: true },
        { $set: { isArchived: false } },
        { new: true }
    )
}

export const hardDeleteMedia = async (id) => {
    return await Media.findByIdAndDelete(id)
}
