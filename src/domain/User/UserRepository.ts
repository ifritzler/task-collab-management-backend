import { UserCreateDto } from "../../services/users/dto/user.create.dto";
import { User } from "./User.entity";

export interface UserRepository {
  create(data: UserCreateDto): Promise<User>;
  update(uuid: string, data: Partial<Omit<User, "id" | "uuid">>): Promise<User>;
  delete(uuid: string): Promise<void>;
  findById(uuid: string): Promise<User | null>;
  findOneByCriteria(criteria: Partial<Pick<User, "email" | "uuid">>): Promise<User | null>;
  findAll(): Promise<User[]>;
}
