import { User } from "../../../domain/User/User";
import { UserModel } from "../../../domain/User/User.model";
import { UserCreateDto } from "../dto/user.create.dto";
import { UserRepository } from "./UserRepository";
import { UserValidationException, UserNotFoundException } from "../exceptions";

export class UserMongoRepository implements UserRepository {
  async create(data: UserCreateDto): Promise<User> {
    const user = new UserModel(data);
    try {
      await user.validate();
    } catch (e: any) {
      throw new UserValidationException(`User validation error: ${e.message}`);
    }
    const userExist = await UserModel.exists({ email: data.email });
    if (userExist) {
      throw new UserValidationException(`User with email '${data.email}' already exist.`);
    }
    user.save();
    return user;
  }

  async update(uuid: string, data: any): Promise<User> {
    const updated = await UserModel.findOneAndUpdate<User>({ uuid }, data, { new: true });
    if (!updated) throw new UserNotFoundException('User with id "' + uuid + '" not found.');
    return updated;
  }

  async delete(uuid: string): Promise<void> {
    await UserModel.updateOne({ uuid }, { active: false, updatedAt: Date.now() });
  }

  async findById(uuid: string): Promise<User> {
    const user = await UserModel.findOne<User>({ uuid });
    if (!user) throw new UserNotFoundException('User with id "' + uuid + '" not found.');
    return user;
  }

  async findAll(): Promise<User[]> {
    const query = await UserModel.find<User>({}, { password: 0, _id: 0 });
    return query;
  }
}
