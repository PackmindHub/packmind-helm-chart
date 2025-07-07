import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

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
const port = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Sentry request handler must be the first middleware
app.use(Sentry.Handlers.requestHandler());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "MCP Server is running", version: "1.0.0" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Test Sentry error handling
app.get("/test-error", (req, res) => {
  throw new Error("Test error for Sentry");
});

// Sentry error handler must be after all routes
app.use(Sentry.Handlers.errorHandler());

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`MCP Server is running on port ${port}`);
});