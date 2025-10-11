import { GoldRate } from "../models/goldRate.model.js";

const GOLD_API_URL = "https://www.goldapi.io/api/XAU/INR";

function getIndiaDateKey(date = new Date()) {
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const ist = new Date(utc + (5.5 * 60 * 60 * 1000));
    const yyyy = ist.getFullYear();
    const mm = String(ist.getMonth() + 1).padStart(2, '0');
    const dd = String(ist.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export const getGoldRateInInr = async () => {
    const todayKey = getIndiaDateKey();

    let record = await GoldRate.findOne({ dateKey: todayKey });
    if (!record) {
        const token = process.env.GOLD_API_TOKEN || "goldapi-1gns919mfw40ss5-io";
        if (!token) {
            throw new Error("GOLD_API_TOKEN not configured");
        }

        const headers = {
            'x-access-token': token,
            'Content-Type': 'application/json'
        };

        const response = await fetch(GOLD_API_URL, { method: 'GET', headers });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`Gold API error: ${response.status} ${text}`);
        }
        const data = await response.json();
        // console.log(data)

        const doc = { dateKey: todayKey, ...data };
        record = await GoldRate.create(doc);
        await GoldRate.deleteMany({ dateKey: { $ne: todayKey } }).catch(() => {});
    }

    return {
        metal: record?.metal,
        currency: record?.currency,
        pricePerOunce: record?.price,
        priceGram24k: record?.price_gram_24k,
        priceGram22k: record?.price_gram_22k,
        priceGram21k: record?.price_gram_21k,
        priceGram20k: record?.price_gram_20k,
        priceGram18k: record?.price_gram_18k,
        priceGram16k: record?.price_gram_16k,
        priceGram14k: record?.price_gram_14k,
        priceGram10k: record?.price_gram_10k,
        timestamp: record?.timestamp
    };
}

export const computeGoldPriceForProduct = (product, goldRate) => {
    if (!goldRate) return null;
    const purity = (product?.purity || '').toString().toLowerCase();
    const weightStr = product?.netWeight || product?.grossWeight;
    const weight = typeof weightStr === 'number' ? weightStr : parseFloat((weightStr || '').toString().replace(/[^0-9.]/g, ''));
    const rateMap = {
        '24k': goldRate.priceGram24k,
        '22k': goldRate.priceGram22k,
        '21k': goldRate.priceGram21k,
        '20k': goldRate.priceGram20k,
        '18k': goldRate.priceGram18k,
        '16k': goldRate.priceGram16k,
        '14k': goldRate.priceGram14k,
        '10k': goldRate.priceGram10k,
    };
    const matchedPurity = Object.keys(rateMap).find(k => purity.includes(k));
    const ratePerGram = matchedPurity ? rateMap[matchedPurity] : (goldRate.priceGram22k || goldRate.priceGram24k);
    if (Number.isFinite(weight) && Number.isFinite(ratePerGram)) {
        return Math.round(weight * ratePerGram);
    }
    return null;
}


