import express from "express";
import userRouter from "./users/users";

const root = express.Router();

root.use("/users", userRouter);

export default root;
