import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";

const apiErrorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode).send({ error: err.message });
};

export default apiErrorHandler;
