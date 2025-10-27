import { MediaGroup } from "../models/mediaGroup.model.js";

export const createMediaGroup = async (obj) => {
    return await MediaGroup.create(obj)
}

export const getMediaGroupById = async (id) => {
    return await MediaGroup.findOne({ _id: id})
}

export const getManyMediaGroups = async (filters = {}) => {
    const query = { ...filters, isArchived: false };
    return await MediaGroup.find(query).sort({ order: 1, createdAt: -1 })
}

export const getAllMediaGroups = async (filters = {}) => {
    return await MediaGroup.find(filters).sort({ order: 1, createdAt: -1 })
}

export const updateMediaGroup = async (id, obj = {}) => {
    return await MediaGroup.findOneAndUpdate(
        { _id: id, isArchived: false },
        { $set: obj },
        { new: true }
    )
}

export const addMediaToGroup = async (id, mediaItems) => {
    return await MediaGroup.findOneAndUpdate(
        { _id: id, isArchived: false },
        { $push: { media: { $each: mediaItems } } },
        { new: true }
    )
}

export const removeMediaFromGroup = async (id, mediaItemId) => {
    return await MediaGroup.findOneAndUpdate(
        { _id: id, isArchived: false },
        { $pull: { media: { _id: mediaItemId } } },
        { new: true }
    )
}

export const deleteMediaGroup = async (id) => {
    return await MediaGroup.findOneAndUpdate(
        { _id: id, isArchived: false },
        { $set: { isArchived: true } },
        { new: true }
    )
}

export const restoreMediaGroup = async (id) => {
    return await MediaGroup.findOneAndUpdate(
        { _id: id, isArchived: true },
        { $set: { isArchived: false } },
        { new: true }
    )
}

export const updateMediaGroupStatus = async (id, isArchived) => {
    return await MediaGroup.findByIdAndUpdate(id, { $set: { isArchived } }, { new: true })
}

export const hardDeleteMediaGroup = async (id) => {
    return await MediaGroup.findByIdAndDelete(id)
}
