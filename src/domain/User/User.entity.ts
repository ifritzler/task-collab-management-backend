import { Roles } from "./types";

export interface User {
  uuid: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  roles: Roles[];
  active: boolean;
  profilePic: string;
  createdAt: number;
  updatedAt: number | null;
  refreshToken: string[];
}
