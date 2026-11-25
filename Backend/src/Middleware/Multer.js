
import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "Public", "temp");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("MULTER FILE:", file);

  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
