import { Roles } from "../../src/domain/User/types";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
      roles?: Roles[];
    }
  }
}
