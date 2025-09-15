import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes/auth.route.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { userRouter } from "./routes/user.route.js";
import logger from "./utils/logger.util.js";
import { enquiryRouter } from "./routes/enquiry.route.js";
import { productRouter } from "./routes/product.route.js";
import { bannerRouter } from "./routes/banner.route.js";

const app = express();

const {
  user_dev_url,
  admin_dev_url,
  user_prod_url,
  admin_prod_url,
  NODE_ENV,
} = process.env;

app.use(cookieParser());

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin || NODE_ENV === "development") {
      callback(null, true);
    } else {
      const allowedOrigins = [
        user_dev_url,
        admin_dev_url,
        user_prod_url,
        admin_prod_url,
      ];
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed by CORS"));
      }
    }
  },
};

// ✅ this was misplaced inside the object earlier
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  return res.send(`
    <html>
      <head><title>Bindu Jewellery</title></head>
      <body>
        <h1>Bindu Jewellery API</h1>
      </body>
    </html>
  `);
});

app.use("/api/auth", authRouter);
app.use("/api/banners", bannerRouter);
app.use("/api/users", userRouter);
app.use("/api/enquiries", enquiryRouter);
app.use("/api/products", productRouter);

app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: null,
    error: "NOT_FOUND",
  })
);

// 🔹 ensure errorHandler is imported before using
app.use(errorHandler);

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.stack || err}`);
  process.exit(1);
});

export default app;
