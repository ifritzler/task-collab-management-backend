import { NextFunction, Request, Response } from "express";
import { Roles } from "../domain/User/types";
import { UnauthorizedApiException } from "../common/ApiGenericErrors";

export const hasRoles = (...allowedRoles: Roles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req?.roles) throw new UnauthorizedApiException();
    const rolesArray = [...allowedRoles];
    const has = req.roles.some((role) => rolesArray.includes(role));
    if (!has) new UnauthorizedApiException();
    next();
  };
};

export default hasRoles;
