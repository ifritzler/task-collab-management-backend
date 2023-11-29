// api-exceptions.ts
import { ApiError } from "./Errors";

export class CustomApiException extends ApiError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}

export class BadRequestApiException extends ApiError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedApiException extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class NotFoundApiException extends ApiError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

export class MethodNotAllowedApiException extends ApiError {
  constructor(message = "Method Not Allowed") {
    super(message, 405);
  }
}

export class ConflictApiException extends ApiError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

export class GoneApiException extends ApiError {
  constructor(message = "Gone") {
    super(message, 410);
  }
}

export class InternalServerErrorApiException extends ApiError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}

export class NotImplementedApiException extends ApiError {
  constructor(message = "Not Implemented") {
    super(message, 501);
  }
}

export class BadGatewayApiException extends ApiError {
  constructor(message = "Bad Gateway") {
    super(message, 502);
  }
}

export class ServiceUnavailableApiException extends ApiError {
  constructor(message = "Service Unavailable") {
    super(message, 503);
  }
}

export class GatewayTimeoutApiException extends ApiError {
  constructor(message = "Gateway Timeout") {
    super(message, 504);
  }
}
