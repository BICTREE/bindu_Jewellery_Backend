import { isValidObjectId } from "mongoose";
import { 
    createMedia, 
    updateMedia, 
    getMediaById, 
    getManyMedia, 
    deleteMedia,
    getMediaByType,
    searchMedia,
    getDeletedMedia,
    getAllMedia,
    restoreMedia,
    hardDeleteMedia,
    updateMediaStatus
} from "../services/media.service.js";
import { deleteFileFromDO } from "../utils/storage.util.js";

export const createMediaCtrl = async (req, res) => {
    try {
        const createObj = req.body;

        const media = await createMedia(createObj);

        if (!media) {
            throw new Error('Failed to create media')
        }

        return res.status(201).json({
            success: true,
            message: 'Media created successfully',
            data: { media },
            error: null
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const getMediaByIdCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        const media = await getMediaById(id)

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Media not found',
                data: null,
                error: 'NOT_FOUND'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'success',
            data: { media },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const getManyMediaCtrl = async (req, res, next) => {
    try {
        let { page, entries } = req.query;
        page = parseInt(page);
        entries = parseInt(entries)
        const { search, filetype, isArchived } = req.query;

        const filters = {};

        if (filetype?.trim()) {
            filters.filetype = filetype.trim();
        }

        if (isArchived !== undefined) {
            filters.isArchived = isArchived === 'true';
        }

        if (search?.trim()) {
            filters.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ]
        }

        let result = await getManyMedia(filters)

        if (page && entries) {
            result = result.slice((page - 1) * entries, page * entries)
        }

        return res.status(200).json({
            success: true,
            message: 'success',
            data: { result },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const getMediaByTypeCtrl = async (req, res) => {
    try {
        const { filetype } = req.params;

        if (!['image', 'video', 'youtube'].includes(filetype)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid filetype. Must be image, video, or youtube',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        const media = await getMediaByType(filetype);

        return res.status(200).json({
            success: true,
            message: 'success',
            data: { media },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const searchMediaCtrl = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        const media = await searchMedia(q.trim());

        return res.status(200).json({
            success: true,
            message: 'success',
            data: { media },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const updateMediaCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        const media = await getMediaById(id)

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Media not found',
                data: null,
                error: 'NOT_FOUND'
            })
        }

        const updateObj = req.body;

        // If updating file and old file exists, delete it from storage
        if (media?.file?.key && (updateObj?.file?.key !== media?.file?.key)) {
            try {
                await deleteFileFromDO(media?.file?.key)
            } catch (error) {
                console.log(error)
            }
        }

        const updatedMedia = await updateMedia(id, updateObj)

        if (!updatedMedia) {
            throw new Error('Failed to update media')
        }

        return res.status(200).json({
            success: true,
            message: 'Media updated successfully',
            data: { media: updatedMedia },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const deleteMediaCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        const media = await deleteMedia(id)

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Media not found',
                data: null,
                error: 'NOT_FOUND'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Media deleted successfully',
            data: null,
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const updateMediaStatusCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        const { status } = req.body;
        if (!['archived', 'unarchived']?.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        const isArchived = status === 'archived';

        const media = await updateMediaStatus(id, isArchived)

        if (!media) {
            throw new Error('FAILED')
        }

        return res.status(200).json({
            success: true,
            message: 'success',
            data: { media },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const getDeletedMediaCtrl = async (req, res) => {
    try {
        let { page, entries } = req.query;
        page = parseInt(page);
        entries = parseInt(entries)
        const { search, filetype } = req.query;

        const filters = {};

        if (filetype?.trim()) {
            filters.filetype = filetype.trim();
        }

        if (search?.trim()) {
            filters.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ]
        }

        let result = await getAllMedia(filters)

        if (page && entries) {
            result = result.slice((page - 1) * entries, page * entries)
        }

        return res.status(200).json({
            success: true,
            message: 'success',
            data: { result },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const restoreMediaCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        const media = await restoreMedia(id)

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Deleted media not found',
                data: null,
                error: 'NOT_FOUND'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Media restored successfully',
            data: { media },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const hardDeleteMediaCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        const media = await hardDeleteMedia(id)

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Media not found',
                data: null,
                error: 'NOT_FOUND'
            })
        }

        // Delete file from storage if it exists
        if (media?.file?.key) {
            try {
                await deleteFileFromDO(media.file.key)
            } catch (error) {
                console.log(error)
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Media permanently deleted',
            data: null,
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}
