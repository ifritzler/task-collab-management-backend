import { NextFunction, Request, Response } from "express";
import { ForbiddenApiException, UnauthorizedApiException } from "../common/ApiGenericErrors";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import config from "../config";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) throw new UnauthorizedApiException();

    const token = authorization.split("Bearer ")[1];
    if (!token) throw new UnauthorizedApiException();

    const verified = jwt.verify(token, config.jwtTokenSecret, { algorithms: ["HS256"] });
    if (typeof verified !== "string") {
      req.user = {
        id: verified.id,
        email: verified.email,
      };
      req.roles = verified.roles;
    }
    next();
  } catch (e) {
    if(e instanceof TokenExpiredError) throw new ForbiddenApiException();
    next(e);
  }
};
