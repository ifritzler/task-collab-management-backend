import { NextFunction, Request, Response } from "express";
import { ApiError } from "../common/Errors";
import config from "../config";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      success: false,
    });
  }

  return res.status(500).json({
    message:
      config.nodeEnv === "production" ? "Unknown error. Contact an administrator." : `${err}`,
  });
};

export default errorHandler;
