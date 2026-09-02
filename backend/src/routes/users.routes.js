import { Router } from "express";
import { 
    login, 
    register, 
    getUserHistory, 
    addToHistory, 
    getAdminStats, 
    getAllUsers, 
    deleteUser 
} from "../controllers/user.controller.js";

const router = Router();

// Regular User Routes
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/user_history").get(getUserHistory);
router.route("/add_to_history").post(addToHistory);

// Admin Routes
router.route("/admin/stats").get(getAdminStats);
router.route("/admin/users").get(getAllUsers);
router.route("/admin/users/:id").delete(deleteUser);

export default router;