import * as express from "express";
import type { Express } from "express";
import { log } from "./index";
import path from "path";

export function serveStatic(app: Express) {
    const rootDir = process.cwd();
    const publicPath = path.resolve(rootDir, "dist", "public");
    const indexPath = path.resolve(publicPath, "index.html");

    log(`serving static files from: ${publicPath}`, "static");

    // Robustly find express.static in CJS bundle
    const exp: any = express;
    const staticHandler = exp.static || exp.default?.static;

    if (typeof staticHandler === 'function') {
        app.use(staticHandler(publicPath));
    } else {
        log(`express type: ${typeof exp}`, "static");
        log("CRITICAL: express.static is not a function in this bundle", "static");
    }

    app.get("*all", (_req, res) => {
        res.sendFile(indexPath);
    });
}
