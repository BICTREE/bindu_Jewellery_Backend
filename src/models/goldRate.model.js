import { model, Schema } from "mongoose";

const goldRateSchema = new Schema({
    // yyyy-mm-dd for India date
    dateKey: { type: String, required: true, unique: true, index: true },
    timestamp: { type: Number },
    metal: { type: String },
    currency: { type: String },
    exchange: { type: String },
    symbol: { type: String },
    prev_close_price: { type: Number },
    open_price: { type: Number },
    low_price: { type: Number },
    high_price: { type: Number },
    open_time: { type: Number },
    price: { type: Number },
    ch: { type: Number },
    chp: { type: Number },
    ask: { type: Number },
    bid: { type: Number },
    price_gram_24k: { type: Number },
    price_gram_22k: { type: Number },
    price_gram_21k: { type: Number },
    price_gram_20k: { type: Number },
    price_gram_18k: { type: Number },
    price_gram_16k: { type: Number },
    price_gram_14k: { type: Number },
    price_gram_10k: { type: Number },
}, { timestamps: true });

export const GoldRate = model('GoldRate', goldRateSchema);