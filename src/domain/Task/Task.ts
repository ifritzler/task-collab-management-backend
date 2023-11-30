import { Tag } from "../Tag/Tag";
import { User } from "../User/User.entity";

export type State = "pending" | "finished";

export interface Task {
  id: number;
  uuid: string;
  title: string;
  createdAt: number;
  expiredAt: number;
  tags: Tag[];
  state: State;
  owner: User;
  collabs: User[] | null;
}
