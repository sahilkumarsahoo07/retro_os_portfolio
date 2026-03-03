import * as express from "express";
import type { Express } from "express";

const expressApp = (express as any).default || express;
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function serveStatic(app: Express) {
    const distPath = path.resolve(__dirname, "..", "dist", "public");
    app.use(expressApp.static(distPath));

    // Fallback for SPA
    app.get("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
    });
}
