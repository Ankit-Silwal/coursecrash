import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.mjs";
import { initRedis } from "./config/redis.mjs";
import { setupRoutes } from "./routes.mjs";

const app = express();
connectDB();
initRedis();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

setupRoutes(app);

app.get('/', (req, res) => {
  res.status(200).json({
    msg: "The server is running correctly"
  });
});

export default app;
