import mongoose from "mongoose";
import { v4 as uuid } from "uuid";
import { User } from "../../../domain/User/User.entity";
import { Roles } from "../../../domain/User/types";
const schema = new mongoose.Schema<User>({
  uuid: { type: "String", unique: true, index: true, default: uuid() },
  name: { type: "String", required: true },
  surname: { type: "String", required: true },
  email: { type: "String", unique: true, index: true, required: true },
  password: { type: "String", required: true },
  profilePic: { type: "String", default: "src/to/path/pic.png" },
  active: { type: "Boolean", default: true },
  createdAt: { type: "Number", default: Date.now() },
  updatedAt: { type: "Number", default: null },
  roles: { type: [Number], default: [Roles.User] },
  refreshToken: { type: [String], default: [] },
});

export const UserModel = mongoose.model("user", schema);
