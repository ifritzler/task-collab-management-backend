import express from "express";
import { UserController } from "../../controllers/user.controller";
import { UserMongoRepository } from "../../services/users/repository/UserMongoRepository.impl";
import { UserService } from "../../services/users/user.service";
import errorHandler from "./errorHandler";
const router = express.Router();
const userController = new UserController(new UserService(new UserMongoRepository()));

// GET /api/users
router.get("/", userController.findAllUsers);
router.get("/:uuid", userController.findUserById);
router.put("/:uuid", userController.update);
router.delete("/:uuid", userController.delete);
router.post("/", userController.create);

router.use(errorHandler);
export default router;
