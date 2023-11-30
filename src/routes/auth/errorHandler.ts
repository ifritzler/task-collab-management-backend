import { NextFunction, Request, Response } from "express";
import { UnauthorizedApiException } from "../../common/ApiGenericErrors";
import { DomainError } from "../../common/Errors";
import { InvalidCredentialsException } from "../../domain/User/User.exceptions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof DomainError && err instanceof InvalidCredentialsException)
    return next(new UnauthorizedApiException(err.message));
  next(err);
};

export default errorHandler;
