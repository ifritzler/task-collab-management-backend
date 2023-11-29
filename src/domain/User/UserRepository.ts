import { UserCreateDto } from "../../services/users/dto/user.create.dto";
import { UserUpdateDto } from "../../services/users/dto/user.update.dto";
import { User } from "./User.entity";

export interface UserRepository {
  create(data: UserCreateDto): Promise<User>;
  update(uuid: string, data: UserUpdateDto): Promise<User>;
  delete(uuid: string): Promise<void>;
  findById(uuid: string): Promise<User>;
  findAll(): Promise<User[]>;
}
