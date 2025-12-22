// server/index.ts
import { config } from "dotenv";
config(); // load .env first

import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";

import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { env } from "./config/env";

const app = express();
const httpServer = createServer(app);

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
 * API request logger middleware
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
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

    if (capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }

    log(logLine);
  });

  next();
});

/**
 * Bootstrap server
 */
async function startServer() {
  try {
    // Register API routes
    await registerRoutes(httpServer, app);

    /**
     * Global error handler (LAST middleware)
     */
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(message, "error");
      res.status(status).json({ message });
    });

    /**
     * Frontend handling
     */
    if (env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    /**
     * 🚀 Start server (Render compatible)
     */
    const PORT = Number(process.env.PORT) || 5000;

    httpServer.listen(PORT, "0.0.0.0", () => {
      log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("🔥 Server failed to start", error);
    process.exit(1);
  }
}

startServer();
