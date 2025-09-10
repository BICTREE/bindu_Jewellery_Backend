import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    credType: {
      type: String,
      enum: ['local', 'google'],
      required: true,
      default: 'local',
    },

    googleId: {
      type: String,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.credType === 'local'; // required only if local login
      },
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
      },
    ],

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = model('User', UserSchema);
