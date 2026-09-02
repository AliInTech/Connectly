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

// Middleware to verify if user is an Admin
const verifyAdmin = async (req, res, next) => {
    try {
        // Front-end se aane wale role/header ko verify karein (ya req.user se check karein)
        const userRole = req.headers["x-user-role"] || req.body.role;
        
        if (userRole === "admin") {
            next(); // Access granted
        } else {
            return res.status(403).json({ message: "Access Denied: Admin rights required!" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error in authorization" });
    }
};

// Regular User Routes
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/user_history").get(getUserHistory);
router.route("/add_to_history").post(addToHistory);

// Protected Admin Routes (Added verifyAdmin middleware)
router.route("/admin/stats").get(verifyAdmin, getAdminStats);
router.route("/admin/users").get(verifyAdmin, getAllUsers);
router.route("/admin/users/:id").delete(verifyAdmin, deleteUser);

export default router;