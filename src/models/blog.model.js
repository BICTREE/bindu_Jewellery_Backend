import { model, Schema } from "mongoose";

const blogSchema = new Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true }, // HTML or rich text from editor
    image: {
        type: {
            name: { type: String },
            key: { type: String },
            location: { type: String },
        }
    },
    tags: [{ type: String }],
    author: { type: String, required: true },
    isArchived: { type: Boolean, default: false },
    publishedAt: { type: Date },
}, { timestamps: true });

export const Blog = model('Blog', blogSchema);


