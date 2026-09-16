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

/**
 * Where uploaded files are stored.
 *
 * Cloud hosts (Railway, Render, ...) give a container an ephemeral filesystem:
 * anything written at runtime disappears on the next deploy or restart. Point
 * UPLOAD_DIR at a mounted persistent volume there so uploads survive. With no
 * volume configured this falls back to the repo's own public/ folder, which is
 * what we want locally.
 */
export const UPLOAD_ROOT = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "public");

/**
 * Files are streamed into a staging folder first and moved into their final
 * <category>/<folder>/ home only once the whole multipart body is parsed.
 *
 * multer's `destination` callback fires while the file part is still arriving,
 * so text fields that come after the file (like "folder") are not in req.body
 * yet. Choosing the directory there wrote the file to one path while the
 * response advertised another -- uploads "succeeded" and then 404'd.
 */
const STAGING_DIR = path.join(UPLOAD_ROOT, ".incoming");

// Only ever write inside UPLOAD_ROOT/<category>/<folder>/ -- both segments are
// reduced to plain filesystem-safe tokens so a crafted value can't escape the
// upload directory (no "..", no path separators).
function sanitizeSegment(value: string, fallback: string): string {
  const cleaned = (value || "").toString().trim().replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);
  return cleaned || fallback;
}

const storage = multer.diskStorage({
  destination: (_req: Request, _file, cb) => {
    fs.mkdirSync(STAGING_DIR, { recursive: true });
    cb(null, STAGING_DIR);
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

// POST /api/uploads/:category  (multipart/form-data: folder=<subfolder>, file=<binary>)
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
    const destDir = path.join(UPLOAD_ROOT, category, folder);

    const urls: string[] = [];
    try {
      fs.mkdirSync(destDir, { recursive: true });
      for (const file of files) {
        fs.renameSync(file.path, path.join(destDir, file.filename));
        urls.push(`/${category}/${folder}/${file.filename}`);
      }
    } catch (moveErr: any) {
      // Clean up whatever is still sitting in staging so a failed upload does
      // not leave orphans behind.
      for (const file of files) {
        try { fs.unlinkSync(file.path); } catch { /* already moved */ }
      }
      return res.status(500).json({
        success: false,
        message: `Could not store uploaded file(s): ${moveErr?.message || moveErr}`,
      });
    }

    res.status(201).json({ success: true, urls, url: urls[0] });
  });
});

export default router;
