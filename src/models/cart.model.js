import { Schema, model } from "mongoose";

const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },

    productId: {
      type: String, // Later can be ObjectId if you have a Product model
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    variations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Variation", // Reference Variation model
      },
    ],
  },
  { timestamps: true }
);

export const Cart = model("Cart", CartSchema);
