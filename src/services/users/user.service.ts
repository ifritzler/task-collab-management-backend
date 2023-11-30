import { User } from "../../domain/User/User.entity";
import { UserNotFoundException } from "../../domain/User/User.exceptions";
import { UserRepository } from "../../domain/User/UserRepository";
import { UserCreateDto } from "./dto/user.create.dto";
import { UserUpdateDto } from "./dto/user.update.dto";

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getAll(): Promise<User[]> {
    const users = await this.repository.findAll();
    return users;
  }

  async create(data: UserCreateDto): Promise<User> {
    const created = await this.repository.create(data);
    return created;
  }

  async update(uuid: string, data: UserUpdateDto): Promise<User> {
    const updated = await this.repository.update(uuid, data);
    return updated;
  }

  async delete(uuid: string): Promise<void> {
    await this.repository.delete(uuid);
  }

  async getById(uuid: string): Promise<User> {
    const user = await this.repository.findById(uuid);
    if (!user) throw new UserNotFoundException();
    return user;
  }
}
