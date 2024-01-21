import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { MulterError } from "multer";

const multerErrorHandler = (
  err: MulterError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    res
      .status(httpStatus.REQUEST_ENTITY_TOO_LARGE)
      .send({ error: "Maximum file size is 5MB" });
  } else {
    res.status(httpStatus.BAD_REQUEST).send({ error: err.message });
  }
};

export default multerErrorHandler;
