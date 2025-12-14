import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.mjs";
import { initRedis } from "./config/redis.mjs";
import { setupRoutes } from "./routes.mjs";

const app = express();

// Initialize database and cache
connectDB();
initRedis();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
setupRoutes(app);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    msg: "The server is running correctly"
  });
});

export default app;
