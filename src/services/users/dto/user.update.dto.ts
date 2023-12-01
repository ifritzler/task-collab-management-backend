import { User } from "../../../domain/User/User.entity";
import { Roles } from "../../../domain/User/types";

export class UserUpdateDto {
  updatedAt: number;
  email: string | undefined;
  name: string | undefined;
  surname: string | undefined;
  profilePic: string | undefined;
  refreshToken: string[] | undefined;
  roles: Roles[] | undefined;

  constructor(
    data: Partial<
      Pick<User, "email" | "name" | "surname" | "profilePic" | "refreshToken" | "roles">
    >,
  ) {
    this.email = data.email;
    this.name = data.name;
    this.surname = data.surname;
    this.profilePic = data.profilePic;
    this.refreshToken = data.refreshToken;
    this.updatedAt = Date.now();
    this.roles = data.roles;
  }

  build() {
    return this;
  }
}
