import { Schema, model } from "mongoose";

const VariationSchema = new Schema(
  {
    variationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    optionId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Variation = model("Variation", VariationSchema);
