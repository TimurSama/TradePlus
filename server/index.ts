import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import config from "./config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Улучшенная обработка ошибок
    const errorResponse = {
      success: false,
      error: message,
      ...(config.nodeEnv === "development" && { stack: err.stack }),
    };

    res.status(status).json(errorResponse);
    
    // Логируем ошибку только в development или для критических ошибок
    if (config.nodeEnv === "development" || status >= 500) {
      console.error("Error:", err);
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (config.nodeEnv === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  log(`Attempting to start server on port ${config.port}...`);
  log(`Environment: ${config.nodeEnv}`);
  server.listen({
    port: config.port,
    host: "0.0.0.0"
  }, () => {
    log(`Server is running at http://localhost:${config.port}`);
  });
})().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
