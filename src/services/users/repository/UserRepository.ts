import { User } from "../../../domain/User/User";
import { UserCreateDto } from "../dto/user.create.dto";
import { UserUpdateDto } from "../dto/user.update.dto";

export interface UserRepository {
  create(data: UserCreateDto): Promise<User>;
  update(uuid: string, data: UserUpdateDto): Promise<User>;
  delete(uuid: string): Promise<void>;
  findById(uuid: string): Promise<User>;
  findAll(): Promise<User[]>;
}
