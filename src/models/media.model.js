import { model, Schema } from "mongoose";

const mediaSchema = new Schema({
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
    isArchived: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Media = model('Media', mediaSchema);
