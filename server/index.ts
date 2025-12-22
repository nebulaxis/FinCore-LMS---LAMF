// server/index.ts
import { config } from "dotenv";
config();

import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import cors from "cors";

import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { env } from "./config/env";

const app = express();
const httpServer = createServer(app);

// ✅ CORS (local + render)
app.use(
  cors({
    origin: true,        // allow same-origin & localhost
    credentials: true,
  })
);

/**
 * Extend IncomingMessage to store rawBody
 */
declare module "http" {
  interface IncomingMessage {
    rawBody?: Buffer;
  }
}

/**
 * Body parsers
 */
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

/**
 * Logger utility
 */
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * API request logger
 */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  let capturedJsonResponse: any;

  const originalResJson = res.json.bind(res);
  res.json = (body: any) => {
    capturedJsonResponse = body;
    return originalResJson(body);
  };

  res.on("finish", () => {
    if (!path.startsWith("/api")) return;

    const duration = Date.now() - start;
    log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
  });

  next();
});

/**
 * Bootstrap server
 */
async function startServer() {
  try {
    await registerRoutes(httpServer, app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      log(err.message || "Internal Server Error", "error");
      res.status(err.status || 500).json({ message: err.message });
    });

    if (env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    const PORT = Number(process.env.PORT) || 5000;
    httpServer.listen(PORT, "0.0.0.0", () => {
      log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("🔥 Server failed to start", err);
    process.exit(1);
  }
}

startServer();
