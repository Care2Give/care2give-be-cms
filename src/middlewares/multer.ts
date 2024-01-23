import multer from "multer";
import { FIVE_MEGABYTES } from "../constants";
import path from "path";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

/**
 * Middleware to store image in-memory before uploading to S3
 */

const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(
        new ApiError(
          httpStatus.UNSUPPORTED_MEDIA_TYPE,
          "Unsupported file type: only jpg, jpeg and png is supported"
        )
      );
    }
    return callback(null, true);
  },
  limits: { fileSize: FIVE_MEGABYTES },
});
