import { Request } from "express";
import path from "path";

import multer, { FileFilterCallback } from "multer";

const storage = multer.diskStorage({
	destination: (req, file, callback) => callback(null, path.join(__dirname, "../../uploads/")),
	filename: (req, file, callback) => callback(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
	if (file.mimetype === "text/csv" || file.mimetype === "application/pdf") {
		callback(null, true);
	} else {
		callback(null, false);
	}
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 1 * 1000 * 1000 } });
