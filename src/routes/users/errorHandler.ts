import { NextFunction, Request, Response } from "express";
import {
  UserAlreadyExistsException,
  UserNotFoundException,
  UserValidationException,
} from "../../services/users/exceptions";
import { DomainError } from "../../common/Errors";
import { BadRequestApiException, NotFoundApiException } from "../../common/ApiGenericErrors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof DomainError && err instanceof UserAlreadyExistsException)
    next(new BadRequestApiException(err.message));
  if (err instanceof DomainError && err instanceof UserValidationException)
    next(new BadRequestApiException(err.message));
  if (err instanceof DomainError && err instanceof UserNotFoundException)
    next(new NotFoundApiException(err.message));
};

export default errorHandler;
