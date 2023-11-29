export class DomainError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.status = statusCode;
  }
}
