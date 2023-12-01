import express from "express";
import { UserController } from "../../controllers/user.controller";
import { UserMongoRepository } from "../../services/users/repository/UserMongoRepository.impl";
import { UserService } from "../../services/users/user.service";
import errorHandler from "./errorHandler";
import { isAuthenticated } from "../../middleware/isAuthenticated";
import { hasRoles } from "../../middleware/verifyRoles";
import { Roles } from "../../domain/User/types";

const router = express.Router();
const userController = new UserController(new UserService(new UserMongoRepository()));

// GET /api/users
router.get("/", isAuthenticated, hasRoles(Roles.Admin), userController.findAllUsers);
router.post("/", isAuthenticated, hasRoles(Roles.Admin), userController.create);
router.get("/:uuid", isAuthenticated, hasRoles(Roles.User), userController.findUserById);
router.put("/:uuid", isAuthenticated, hasRoles(Roles.User, Roles.Admin), userController.update);
router.delete("/:uuid", isAuthenticated, hasRoles(Roles.User, Roles.Admin), userController.delete);

router.use(errorHandler);
export default router;
