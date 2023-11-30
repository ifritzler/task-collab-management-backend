import { User } from "../../../domain/User/User.entity";

export class UserUpdateDto {
  updatedAt: number;
  email: string | undefined;
  name: string | undefined;
  surname: string | undefined;
  profilePic: string | undefined;
  refreshToken: string[] | undefined;

  constructor(
    data: Partial<Pick<User, "email" | "name" | "surname" | "profilePic" | "refreshToken">>,
  ) {
    this.email = data.email;
    this.name = data.name;
    this.surname = data.surname;
    this.profilePic = data.profilePic;
    this.refreshToken = data.refreshToken;
    this.updatedAt = Date.now();
  }

  build() {
    return this;
  }
}
