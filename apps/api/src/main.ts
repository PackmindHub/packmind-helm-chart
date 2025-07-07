import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  integrations: [
    nodeProfilingIntegration(),
    Sentry.httpIntegration({ tracing: true }),
    Sentry.expressIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  debug: process.env.NODE_ENV === "development",
});

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Sentry request handler must be the first middleware
app.use(Sentry.Handlers.requestHandler());

// Database connection
async function connectDB() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB");
    } else {
      console.log("MongoDB URI not provided, skipping database connection");
    }
  } catch (error) {
    console.error("Database connection error:", error);
    Sentry.captureException(error);
  }
}

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Packmind API is running", version: "1.0.0" });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// API routes
app.get("/api/plugin", (req, res) => {
  res.json({ message: "Plugin API endpoint" });
});

app.get("/api/suggestion", (req, res) => {
  res.json({ message: "Suggestion API endpoint" });
});

// Test Sentry error handling
app.get("/api/test-error", (req, res) => {
  throw new Error("Test error for Sentry");
});

// Sentry error handler must be after all routes
app.use(Sentry.Handlers.errorHandler());

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log(`API Server is running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  Sentry.captureException(error);
  process.exit(1);
});