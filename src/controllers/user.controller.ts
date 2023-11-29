import { NextFunction, Request, Response } from "express";
import { UserCreateDto } from "../services/users/dto/user.create.dto";
import { UserResponseDto } from "../services/users/dto/user.response.dto";
import { UserUpdateDto } from "../services/users/dto/user.update.dto";
import { UserService } from "../services/users/user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}
  findAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAll();
      res.status(200).json({
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

  findUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uuid } = req.params;
      if (!uuid) {
        return res.status(400).json({
          message: "Uuid is not defined",
        });
      }
      const user = await this.userService.getById(uuid);
      res.status(200).json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCreateDto = new UserCreateDto(req.body);
      const user = await this.userService.create(userCreateDto);
      const response = UserResponseDto.fromUserEntity(user);
      res.status(201).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uuid } = req.params;
      if (!uuid) {
        return res.status(400).json({
          message: "Uuid is not defined",
        });
      }
      const userUpdateDto = new UserUpdateDto(req.body);
      const user = await this.userService.update(uuid, userUpdateDto);
      const response = UserResponseDto.fromUserEntity(user);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uuid } = req.params;
      if (!uuid) {
        return res.status(400).json({
          message: "Uuid is not defined",
        });
      }
      await this.userService.delete(uuid);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
