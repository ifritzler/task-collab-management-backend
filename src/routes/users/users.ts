import express from "express";
import { UserController } from "../../controllers/user.controller";
import { UserMongoRepository } from "../../services/users/repository/UserMongoRepository.impl";
import { UserService } from "../../services/users/user.service";
import errorHandler from "./errorHandler";
import { isLoguedIn } from "../../middleware/isLoguedIn";

const router = express.Router();
const userController = new UserController(new UserService(new UserMongoRepository()));

// GET /api/users
router.get("/", isLoguedIn, userController.findAllUsers);
router.get("/:uuid", isLoguedIn, userController.findUserById);
router.put("/:uuid", isLoguedIn, userController.update);
router.delete("/:uuid", isLoguedIn, userController.delete);
router.post("/", isLoguedIn, userController.create);

router.use(errorHandler);
export default router;
