import { Schema, model } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    productID: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    grossWeight: {
      type: String,
    },
    netWeight: {
      type: String,
    },
    stoneWeight: {
      type: String,
    },
    stoneCount: {
      type: Number,
      default: 0,
    },
    metalType: {
      type: String,
    },
    productDimensions: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    makingCharges: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    stonePrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    gst: {
      type: Number,
      min: 0,
      default: 0,
    },
    thumbnail: {
      location: { type: String },
      name: { type: String },
      key: { type: String },
    },
    images: [
      {
        location: { type: String, required: true },
        name: { type: String },
        key: { type: String },
      },
    ],
    variantItems: [
      {
        sku: { type: String },
        stock: { type: Number, default: 0 },
        extraPrice: { type: Number, default: 0 },
        specs: [
          {
            variationId: { type: Schema.Types.ObjectId, ref: 'Variation' },
            optionId: { type: Schema.Types.ObjectId, ref: 'Option' },
          },
        ],
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = model('Product', ProductSchema);
