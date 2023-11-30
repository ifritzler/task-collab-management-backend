import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedApiException } from "../common/ApiGenericErrors";
import config from "../config";
import { AuthService } from "../services/auth/auth.service";
import { AuthDto } from "../services/auth/dto/auth.dto";
import { UserUpdateDto } from "../services/users/dto/user.update.dto";
import { UserService } from "../services/users/user.service";

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const authorization = req.headers["authorization"];
      const authorization = req.cookies.jwt;
      res.clearCookie("jwt", { httpOnly: true });
      if (authorization) {
        const decoded = jwt.decode(authorization, { json: true });
        const user = await this.userService.getById(decoded?.id);
        if (user) {
          const dto = new UserUpdateDto({ refreshToken: [...user.refreshToken, authorization] });
          await this.userService.update(decoded?.id, dto);
        }
      }
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authParams = new AuthDto(req.body);
      const user = await this.authService.login(authParams);
      if (!user) {
        throw new UnauthorizedApiException("Invalid credentials");
      }
      const accessToken = jwt.sign(
        {
          id: user.uuid,
          email: user.email,
        },
        config.jwtTokenSecret,
        { algorithm: "HS256", expiresIn: "5m" },
      );
      const refreshToken = jwt.sign(
        {
          id: user.uuid,
          email: user.email,
        },
        config.jwtTokenSecret,
        { algorithm: "HS256", expiresIn: "3 days" },
      );
      res.cookie("jwt", refreshToken, { httpOnly: true });

      return res.status(200).json({
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };
}
