import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = path.resolve(process.cwd(), "uploads", "images");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-");

    const extension = path.extname(safeName) || ".jpg";
    const baseName = path.basename(safeName, extension).slice(0, 40) || "image";
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;

    cb(null, `${baseName}-${uniqueSuffix}${extension}`);
  },
});

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Only image files are allowed"));
};

export const uploadImageFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
