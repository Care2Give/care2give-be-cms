import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import httpStatus from "http-status";
import config from "./config/config";
import morgan from "./config/morgan";
import xss from "./middlewares/xss";
import { authLimiter } from "./middlewares/rateLimiter";
import testRoutes from "./routes";
import v1Routes from "./routes/v1";
import ApiError from "./utils/ApiError";

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// limit repeated failed requests to auth endpoints
// if (config.env === "production") {
//   app.use("/v1/auth", authLimiter);
// }

// test api routes
app.use("/", testRoutes);

// v1 api routes
app.use("/v1", v1Routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

export default app;
