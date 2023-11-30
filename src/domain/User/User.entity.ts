export interface User {
  uuid: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  active: boolean;
  profilePic: string;
  createdAt: number;
  updatedAt: number | null;
  refreshToken: string[];
}
