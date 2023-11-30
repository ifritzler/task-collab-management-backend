import express from "express";
import { AuthController } from "../../controllers/auth.controller";
import { AuthService } from "../../services/auth/auth.service";
import { UserMongoRepository } from "../../services/users/repository/UserMongoRepository.impl";
import errorHandler from "./errorHandler";
import { UserService } from "../../services/users/user.service";

// /api/auth
const router = express.Router();
const userRepository = new UserMongoRepository();
const authController = new AuthController(
  new AuthService(userRepository),
  new UserService(userRepository),
);

router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.use(errorHandler);
export default router;
