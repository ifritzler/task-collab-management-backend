import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { promisify } from "util";
import { UserCreateDto } from "../services/users/dto/user.create.dto";
import { UserResponseDto } from "../services/users/dto/user.response.dto";
import { UserUpdateDto } from "../services/users/dto/user.update.dto";
import { UserService } from "../services/users/user.service";

const unlink = promisify(fs.unlink);
export class UserController {
  constructor(private readonly userService: UserService) {}
  findAllUsers = async (req: Request, res: Response, next: NextFunction) => {
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
      let profilePicPath = "/profile/placeholder.png";
      if (this.existProfilePic(req)) {
        profilePicPath = `/profile/${userCreateDto.uuid}.${
          // @ts-expect-error any
          req.files.profilepic.name.split(".")[1]
        }`;
      }
      userCreateDto.profilePic = profilePicPath;
      const user = await this.userService.create(userCreateDto);
      if (this.existProfilePic(req)) {
        // @ts-expect-error any
        req.files.profilepic.mv(`./public${profilePicPath}`);
      }
      const response = UserResponseDto.fromUserEntity(user);
      res.status(201).json({
        data: response,
      });
    } catch (error) {
      if (this.existProfilePic(req)) {
        // @ts-expect-error any
        unlink(req.files.profilepic.tempFilePath);
      }
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

  private existProfilePic(req: Request) {
    return req.files && req.files.profilepic && !Array.isArray(req.files.profilepic);
  }
}
