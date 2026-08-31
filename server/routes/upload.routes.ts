/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

const PUBLIC_ROOT = path.join(process.cwd(), "public");

// Only ever write inside public/<category>/<folder>/ -- category and folder are
// sanitized to plain filesystem-safe tokens so a crafted value can't escape
// the upload directory (no "..", no path separators).
function sanitizeSegment(value: string, fallback: string): string {
  const cleaned = (value || "").toString().trim().replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);
  return cleaned || fallback;
}

const storage = multer.diskStorage({
  destination: (req: Request, _file, cb) => {
    const category = sanitizeSegment(req.params.category, "uploads");
    const folder = sanitizeSegment((req.body?.folder as string) || "", `misc-${Date.now()}`);
    const dir = path.join(PUBLIC_ROOT, category, folder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-zA-Z0-9.]/g, "");
    const base = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 60);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const ALLOWED_MIME = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml",
]);

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error("Only image files (jpeg, png, webp, gif, avif, svg) are allowed."));
    }
    cb(null, true);
  },
});

// POST /api/uploads/:category  (multipart/form-data: file=<binary>, folder=<optional subfolder>)
// category is a free path segment like "property-photos" or "buildings".
router.post("/:category", authenticateJWT, (req: Request, res: Response) => {
  upload.array("file", 10)(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || "Upload failed." });
    }
    const files = (req.files as Express.Multer.File[]) || [];
    if (files.length === 0) {
      return res.status(400).json({ success: false, message: "No file received." });
    }
    const category = sanitizeSegment(req.params.category, "uploads");
    const folder = sanitizeSegment((req.body?.folder as string) || "", "misc");
    const urls = files.map((f) => `/${category}/${folder}/${f.filename}`);
    res.status(201).json({ success: true, urls, url: urls[0] });
  });
});

export default router;
