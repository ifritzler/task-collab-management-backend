import { InvalidCredentialsException } from "../../../domain/User/User.exceptions";

export interface AuthParams {
  email: string;
  password: string;
}

export class AuthDto implements AuthParams {
  email: string;
  password: string;
  constructor(data: any) {
    this.email = data.email;
    this.password = data.password;
  }

  build() {
    if (!this.email || !this.password) {
      throw new InvalidCredentialsException();
    }
    return this;
  }
}
