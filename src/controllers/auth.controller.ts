import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { ForbiddenApiException, UnauthorizedApiException } from "../common/ApiGenericErrors";
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
          roles: user.roles,
        },
        config.jwtTokenSecret,
        { algorithm: "HS256", expiresIn: "10m" },
      );
      const refreshToken = jwt.sign(
        {
          id: user.uuid,
          email: user.email,
          roles: user.roles,
        },
        config.jwtRefreshSecret,
        { algorithm: "HS256", expiresIn: "3 days" },
      );
      res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none" });

      return res.status(200).json({
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.jwt;
      res.clearCookie("jwt", { httpOnly: true, sameSite: "none" });
      if (refreshToken) {
        const decoded = jwt.decode(refreshToken, { json: true });
        if (!decoded) return res.status(204).send();

        const user = await this.userService.getById(decoded.id);
        if (!user) return res.status(204).send();

        // Invalidate token
        await this.userService.update(
          user.uuid,
          new UserUpdateDto({ refreshToken: [...user.refreshToken, refreshToken] }),
        );
      }
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshTokenCookieValue = req.cookies.jwt;
      if (!refreshTokenCookieValue) throw new UnauthorizedApiException();

      res.clearCookie("jwt", { httpOnly: true, sameSite: "none" });

      const verified = jwt.verify(refreshTokenCookieValue, config.jwtRefreshSecret, {
        algorithms: ["HS256"],
      });
      let user = null;
      if (typeof verified !== "string") {
        user = await this.userService.getById(verified.id);
      }
      if (!user) throw new UnauthorizedApiException();
      await this.userService.update(
        user.uuid,
        new UserUpdateDto({ refreshToken: [...user.refreshToken, refreshTokenCookieValue] }),
      );

      const roles = user.roles;
      const payload = {
        id: user.uuid,
        email: user.email,
        roles,
      };
      const accessToken = jwt.sign(payload, config.jwtTokenSecret, {
        algorithm: "HS256",
        expiresIn: "10m",
      });
      const newRefreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
        algorithm: "HS256",
        expiresIn: "3 days",
      });
      res.cookie("jwt", newRefreshToken, { httpOnly: true, sameSite: "none" });
      return res.status(200).json({ accessToken });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return next(new UnauthorizedApiException("Authentication Token expired"));
      }
      if (e instanceof JsonWebTokenError) {
        return next(new UnauthorizedApiException("Authentication Token expired"));
      }
      next(e);
    }
  };
}
