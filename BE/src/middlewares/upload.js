import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsRoot = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadsRoot)) {
	fs.mkdirSync(uploadsRoot, { recursive: true });
}

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, uploadsRoot);
	},
	filename(req, file, cb) {
		const timestamp = Date.now();
		const ext = path.extname(file.originalname);
		const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
		cb(null, `${base}-${timestamp}${ext}`);
	},
});

const imageFileFilter = (req, file, cb) => {
	const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
	if (!allowed.includes(file.mimetype)) return cb(new Error("Only image files are allowed"));
	cb(null, true);
};

const maxSizeMb = Number(process.env.UPLOAD_MAX_MB || 5);
export const uploadImage = multer({ storage, fileFilter: imageFileFilter, limits: { fileSize: maxSizeMb * 1024 * 1024 } });


