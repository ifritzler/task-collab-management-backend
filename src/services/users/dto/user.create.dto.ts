import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { User } from "../../../domain/User/User.entity";
import { Roles } from "../../../domain/User/types";

export class UserCreateDto {
  uuid: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  profilePic: string;
  active: boolean;
  createdAt: number;
  updatedAt: number | null;
  roles: Roles[];

  constructor(
    data: Pick<User, "name" | "surname" | "email" | "password" | "profilePic" | "roles">,
  ) {
    this.name = data.name;
    this.surname = data.surname;
    this.email = data.email;
    this.password = bcrypt.hashSync(data.password, 10);
    this.profilePic = data.profilePic;

    this.uuid = uuid();
    this.active = true;
    this.createdAt = Date.now();
    this.updatedAt = null;
    this.roles = [Roles.User];
  }

  build() {
    return this;
  }
}
