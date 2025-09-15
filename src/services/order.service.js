import { Order } from "../models/order.model.js";
import { sendEmail } from "../utils/mailer.util.js";
import { getUserById } from "./user.service.js";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";

dayjs.extend(isoWeek);


export const findManyOrders = async (filters = {}, project = {}) => {
    return await Order.find(filters, project)
        .populate("userId", "firstName lastName email mobile")
        .populate("billAddress")
        .populate("shipAddress")
        .sort({ createdAt: -1 })
}


export const getAllOrders = async ({
    filters = {},
    advancedFilters = {},
    sort = { createdAt: -1 },
    page,
    entries,
} = {}) => {
    const pipeline = [];

    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "customer"
            }
        },
        {
            $addFields: {
                customer: {
                    $ifNull: [{ $arrayElemAt: ["$customer", 0] }, null]
                }
            }
        },
    )

    pipeline.push({
        $match: {
            ...filters,
            ...advancedFilters,
        },
    });

    pipeline.push({ $sort: sort });

    if (page && entries) {
        pipeline.push({ $skip: (page - 1) * entries });
        pipeline.push({ $limit: entries })
    }

    return await Order.aggregate(pipeline);
}
