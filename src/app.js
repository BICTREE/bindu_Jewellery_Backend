import "dotenv/config";
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
import { categoryRouter } from "./routes/category.route.js";
import { reviewRouter } from "./routes/review.route.js";
import { uploadRouter } from "./routes/upload.route.js";
import { blogRouter } from "./routes/blog.route.js";
import { mediaRouter } from "./routes/media.route.js";

const app = express();

const { user_dev_url, admin_dev_url, user_prod_url, admin_prod_url, NODE_ENV } =
  process.env;

// Debug environment variables
console.log("=== Environment Debug ===");
console.log("NODE_ENV:", `"${NODE_ENV}"`);
console.log("user_dev_url:", user_dev_url);
console.log("admin_dev_url:", admin_dev_url);
console.log("user_prod_url:", user_prod_url);
console.log("admin_prod_url:", admin_prod_url);
console.log(
  "All process.env keys:",
  Object.keys(process.env).filter(
    (key) => key.includes("NODE_ENV") || key.includes("url")
  )
);
console.log("========================");

app.use(cookieParser());

// Fixed CORS configuration
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    console.log("Incoming Origin:", origin);

    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      console.log("✅ Allowing request with no origin");
      return callback(null, true);
    }

    // Check if we're in development mode - multiple ways to check
    const isDevelopment =
      NODE_ENV?.toLowerCase().trim() === "development" ||
      process.env.NODE_ENV?.toLowerCase().trim() === "development" ||
      !NODE_ENV || // If NODE_ENV is not set, assume development
      NODE_ENV === undefined;

    console.log("Is Development Mode:", isDevelopment);

    // TEMPORARY FIX: Allow localhost origins in development
    const isLocalhost =
      origin &&
      (origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.includes("::1"));

    if (isDevelopment || isLocalhost) {
      console.log(
        "✅ Development mode or localhost - allowing origin:",
        origin
      );
      return callback(null, true);
    }

    // In production, check against allowed origins
    const allowedOrigins = [
      user_dev_url,
      admin_dev_url,
      user_prod_url,
      admin_prod_url,
      // Fallback localhost URLs in case env vars aren't working
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "https://bindu-jewellery-admin-side.vercel.app",
      "https://bindu-jewellery-frontend.vercel.app",
    ].filter(Boolean); // Remove any undefined/null values

    console.log("Allowed origins:", allowedOrigins);

    if (allowedOrigins.includes(origin)) {
      console.log("✅ Origin allowed:", origin);
      callback(null, true);
    } else {
      console.log("❌ Origin not allowed:", origin);
      callback(new Error("Origin not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  return res.send(`
    <html>
      <head><title>Bindu Jewellery</title></head>
      <body>
        <h1>Bindu Jewellery API</h1>
        <p>Environment: ${NODE_ENV}</p>
        <p>Server is running properly!</p>
      </body>
    </html>
  `);
});


// API routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/enquiries", enquiryRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/media", mediaRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/banners", bannerRouter);

// 404 handler
app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: null,
    error: "NOT_FOUND",
  })
);

// Error handler (should be last)
app.use(errorHandler);

// Process error handlers
process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.stack || err}`);
  process.exit(1);
});

export default app;
