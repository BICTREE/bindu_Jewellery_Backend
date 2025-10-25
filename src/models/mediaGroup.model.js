import { model, Schema } from "mongoose";

const mediaItemSchema = new Schema({
    filetype: { 
        type: String,
        required: true,
        enum: ['image', 'video', 'youtube']
    },
    file: { 
        type: {
            name: { type: String },
            key: { type: String },
            location: { type: String },
        }
    },
    youtubeLink: {
        type: String,
        required: function() {
            return this.filetype === 'youtube';
        }
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    tags: [{
        type: String
    }],
    order: {
        type: Number,
        default: 0
    }
}, { _id: true });

const mediaGroupSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    media: [mediaItemSchema],
    isArchived: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const MediaGroup = model('MediaGroup', mediaGroupSchema);
