import multer from "multer";

/**
 * Middleware to store image in-memory before uploading to S3
 */
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
