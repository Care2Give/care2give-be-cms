import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { MulterError } from "multer";
import httpStatus from "http-status";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).send({ error: err.message });
  } else if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res
        .status(httpStatus.REQUEST_ENTITY_TOO_LARGE)
        .send({ error: "Maximum file size is 5MB" });
    } else {
      res.status(httpStatus.BAD_REQUEST).send({ error: err.message });
    }
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err.message });
  }
};

export default errorHandler;
