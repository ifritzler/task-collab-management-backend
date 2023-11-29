import { User } from "../../../domain/User/User";
import { v4 as uuid } from "uuid";

export class UserResponseDto {
  uuid: string;
  name: string;
  surname: string;
  email: string;
  profilePic: string;
  active: boolean;
  createdAt: number;
  updatedAt: number;

  private constructor(data: Omit<User, "id" | "password">) {
    this.name = data.name;
    this.surname = data.surname;
    this.email = data.email;
    this.profilePic = data.profilePic;

    this.uuid = uuid();
    this.active = true;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }

  static fromUserEntity(user: User) {
    return new UserResponseDto({
      uuid: user.uuid,
      name: user.name,
      surname: user.surname,
      email: user.email,
      profilePic: user.profilePic,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
