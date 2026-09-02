import { Router } from "express";
import { 
    login, 
    register, 
    getUserHistory, 
    addToHistory 
} from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/user_history").get(getUserHistory);
router.route("/add_to_history").post(addToHistory);

export default router;