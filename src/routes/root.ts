import express from "express";
import authRouter from "./auth/auth";
import userRouter from "./users/users";

const root = express.Router();

root.use("/auth", authRouter);
root.use("/users", userRouter);

export default root;
