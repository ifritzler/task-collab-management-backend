import bcrypt from "bcrypt";
import { InvalidCredentialsException } from "../../domain/User/User.exceptions";
import { UserRepository } from "../../domain/User/UserRepository";
import { AuthParams } from "../auth/dto/auth.dto";

export class AuthService {
  constructor(private readonly repository: UserRepository) {}

  async login(auth: AuthParams) {
    const user = await this.repository.findOneByCriteria({ email: auth.email });
    if (!user) throw new InvalidCredentialsException();

    if (!bcrypt.compareSync(auth.password, user.password)) {
      throw new InvalidCredentialsException();
    }
    return user;
  }

  async logout(email: string): Promise<void> {
    const user = await this.repository.findOneByCriteria({ email });
    if (!user) throw new InvalidCredentialsException();
    await this.repository.update(user.uuid, { refreshToken: [] });
  }
}
