import { DomainError } from "../../common/Errors";

export class UserValidationException extends DomainError {
  constructor(message: string = "User validation error") {
    super(message);
  }
}

export class UserNotFoundException extends DomainError {
  constructor(message: string = "User not found.") {
    super(message);
  }
}

export class UserAlreadyExistsException extends DomainError {
  constructor(message: string = "User already exists.") {
    super(message);
  }
}

export class InvalidCredentialsException extends DomainError {
  constructor(message: string = "Invalid Credentials.") {
    super(message);
  }
}
