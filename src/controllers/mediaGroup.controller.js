import { isValidObjectId } from "mongoose";
import {
    createMediaGroup,
    updateMediaGroup,
    getMediaGroupById,
    getManyMediaGroups,
    deleteMediaGroup,
    getAllMediaGroups,
    restoreMediaGroup,
    updateMediaGroupStatus,
    addMediaToGroup,
    removeMediaFromGroup,
    hardDeleteMediaGroup
} from "../services/mediaGroup.service.js";

export const createMediaGroupCtrl = async (req, res) => {
    try {
        const createObj = req.body;
        const group = await createMediaGroup(createObj);
        if (!group) throw new Error('Failed to create media group');
        return res.status(201).json({ success: true, message: 'Media group created successfully', data: { group }, error: null })
    } catch (error) {
        console.error(error);
        
        // Handle duplicate key error
        if (error.code === 11000 || error.code === 11001) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({ 
                success: false, 
                message: `Media group with this ${field} already exists`, 
                data: null, 
                error: 'DUPLICATE_ENTRY' 
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: 'Internal Server error', 
            data: null, 
            error: 'INTERNAL_SERVER_ERROR' 
        });
    }
}

export const getMediaGroupByIdCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid Id', data: null, error: 'BAD_REQUEST' })
        const group = await getMediaGroupById(id);
        if (!group) return res.status(404).json({ success: false, message: 'Not Found', data: null, error: 'NOT_FOUND' })
        return res.status(200).json({ success: true, message: 'success', data: { group }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getManyMediaGroupsCtrl = async (req, res) => {
    try {
        let { page, entries } = req.query; page = parseInt(page); entries = parseInt(entries);
        const { search } = req.query;
        const filters = {};
        if (search?.trim()) {
            filters.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') }
            ]
        }
        let result = await getManyMediaGroups(filters);
        if (page && entries) result = result.slice((page - 1) * entries, page * entries)
        return res.status(200).json({ success: true, message: 'success', data: { result }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const addMediaToGroupCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        const { mediaItems } = req.body;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid Id', data: null, error: 'BAD_REQUEST' })
        if (!Array.isArray(mediaItems)) return res.status(400).json({ success: false, message: 'Media items must be an array', data: null, error: 'BAD_REQUEST' })
        const group = await addMediaToGroup(id, mediaItems);
        if (!group) return res.status(404).json({ success: false, message: 'Group not found', data: null, error: 'NOT_FOUND' })
        return res.status(200).json({ success: true, message: 'Media added to group', data: { group }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const removeMediaFromGroupCtrl = async (req, res) => {
    try {
        const { id, mediaItemId } = req.params;
        if (!isValidObjectId(id) || !isValidObjectId(mediaItemId)) return res.status(400).json({ success: false, message: 'Invalid Id', data: null, error: 'BAD_REQUEST' })
        const group = await removeMediaFromGroup(id, mediaItemId);
        if (!group) return res.status(404).json({ success: false, message: 'Group or media item not found', data: null, error: 'NOT_FOUND' })
        return res.status(200).json({ success: true, message: 'Media removed from group', data: { group }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const getAllMediaGroupsCtrl = async (req, res) => {
    try {
        let { page, entries } = req.query; page = parseInt(page); entries = parseInt(entries);
        const { search } = req.query;
        const filters = {};
        if (search?.trim()) {
            filters.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') }
            ]
        }
        let result = await getAllMediaGroups(filters);
        if (page && entries) result = result.slice((page - 1) * entries, page * entries)
        return res.status(200).json({ success: true, message: 'success', data: { result }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const updateMediaGroupCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ 
            success: false, 
            message: 'Invalid Id', 
            data: null, 
            error: 'BAD_REQUEST' 
        });
        
        const group = await updateMediaGroup(id, req.body);
        if (!group) throw new Error('Media group not found');
        
        return res.status(200).json({ 
            success: true, 
            message: 'Media group updated successfully', 
            data: { group }, 
            error: null 
        });
    } catch (error) {
        console.error(error);
        
        // Handle duplicate key error
        if (error.code === 11000 || error.code === 11001) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({ 
                success: false, 
                message: `Media group with this ${field} already exists`, 
                data: null, 
                error: 'DUPLICATE_ENTRY' 
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: 'Internal Server error', 
            data: null, 
            error: 'INTERNAL_SERVER_ERROR' 
        });
    }
}

export const updateMediaGroupStatusCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid Id', data: null, error: 'BAD_REQUEST' })
        const { status } = req.body;
        if (!['archived', 'unarchived']?.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status', data: null, error: 'BAD_REQUEST' })
        const isArchived = status === 'archived';
        const group = await updateMediaGroupStatus(id, isArchived);
        if (!group) throw new Error('FAILED');
        return res.status(200).json({ success: true, message: 'success', data: { group }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const deleteMediaGroupCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid Id', data: null, error: 'BAD_REQUEST' })
        const group = await deleteMediaGroup(id);
        if (!group) return res.status(404).json({ success: false, message: 'Not Found', data: null, error: 'NOT_FOUND' })
        return res.status(200).json({ success: true, message: 'Media group archived', data: null, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const restoreMediaGroupCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid Id', data: null, error: 'BAD_REQUEST' })
        const group = await restoreMediaGroup(id);
        if (!group) return res.status(404).json({ success: false, message: 'Not Found', data: null, error: 'NOT_FOUND' })
        return res.status(200).json({ success: true, message: 'Media group restored', data: { group }, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}

export const hardDeleteMediaGroupCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid Id', data: null, error: 'BAD_REQUEST' })
        const group = await hardDeleteMediaGroup(id);
        if (!group) return res.status(404).json({ success: false, message: 'Not Found', data: null, error: 'NOT_FOUND' })
        return res.status(200).json({ success: true, message: 'Media group permanently deleted', data: null, error: null })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server error', data: null, error: 'INTERNAL_SERVER_ERROR' })
    }
}
