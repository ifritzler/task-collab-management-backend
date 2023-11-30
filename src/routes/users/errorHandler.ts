import { NextFunction, Request, Response } from "express";
import { BadRequestApiException, NotFoundApiException } from "../../common/ApiGenericErrors";
import { DomainError } from "../../common/Errors";
import {
  UserAlreadyExistsException,
  UserNotFoundException,
  UserValidationException,
} from "../../domain/User/User.exceptions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof DomainError && err instanceof UserAlreadyExistsException)
    return next(new BadRequestApiException(err.message));
  if (err instanceof DomainError && err instanceof UserValidationException)
    return next(new BadRequestApiException(err.message));
  if (err instanceof DomainError && err instanceof UserNotFoundException)
    return next(new NotFoundApiException(err.message));
  next(err)
};

export default errorHandler;
