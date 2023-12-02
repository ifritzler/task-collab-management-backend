import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { ForbiddenApiException, UnauthorizedApiException } from "../common/ApiGenericErrors";
import config from "../config";
import { AuthService } from "../services/auth/auth.service";
import { AuthDto } from "../services/auth/dto/auth.dto";
import { UserUpdateDto } from "../services/users/dto/user.update.dto";
import { UserService } from "../services/users/user.service";
import { User } from "../domain/User/User.entity";

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
        { algorithm: "HS256", expiresIn: "40s" },
      );
      const refreshToken = jwt.sign(
        {
          id: user.uuid,
          email: user.email,
          roles: user.roles,
        },
        config.jwtRefreshSecret,
        { algorithm: "HS256", expiresIn: "3m" },
      );
      res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 3 * 60 * 1000, signed: true });

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
      res.clearCookie("jwt");
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
      const refreshTokenCookieValue = req.signedCookies.jwt;
      if (!refreshTokenCookieValue) throw new ForbiddenApiException();

      res.clearCookie("jwt", { httpOnly: true, maxAge: 3 * 60 * 1000, signed: true });

      const verified = jwt.verify(refreshTokenCookieValue, config.jwtRefreshSecret, {
        algorithms: ["HS256"],
      });
      let user: User | null = null;
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
        expiresIn: "40s",
      });
      const newRefreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
        algorithm: "HS256",
        expiresIn: "3m",
      });
      res.cookie("jwt", newRefreshToken, { httpOnly: true, maxAge: 3 * 60 * 1000, signed: true });
      return res.status(200).json({ accessToken });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return next(new ForbiddenApiException("Forbidden - Authentication Token expired"));
      }
      if (e instanceof JsonWebTokenError) {
        return next(new UnauthorizedApiException("Unauthorized - Malformed Token"));
      }
      next(e);
    }
  };
}
