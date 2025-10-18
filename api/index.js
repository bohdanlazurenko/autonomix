import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes from backend
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Dynamically import routes
const tasksRouter = await import("../backend/src/routes/tasks.js").then(m => m.default);
const tenantsRouter = await import("../backend/src/routes/tenants.js").then(m => m.default);
const healthRouter = await import("../backend/src/routes/health.js").then(m => m.default);

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Routes
app.use("/api/health", healthRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/tenants", tenantsRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal server error",
      status: err.status || 500,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Not found",
      status: 404,
    },
  });
});

// Export for Vercel serverless
export default app;
