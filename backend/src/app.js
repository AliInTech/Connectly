import mongoose from "mongoose";
import { User } from "./models/user.model.js";

// Aapki app.js se MongoDB link direct yahan set kar diya hai:
const MONGO_URI = "mongodb+srv://imdigitalashish:imdigitalashish@cluster0.cujabk4.mongodb.net/"; 

const makeUserAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected successfully!");

        // Yahan apna username likhein jise Admin banana hai (e.g. "laraib")
        const targetUsername = "APNA_USERNAME_HERE"; 

        const user = await User.findOne({ username: targetUsername });

        if (!user) {
            console.log(`❌ User '${targetUsername}' nahi mila! Make sure username sahi ho.`);
        } else {
            user.role = "admin";
            await user.save();
            console.log(`✅ Success! User '${targetUsername}' ab Admin ban chuka hai.`);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

makeUserAdmin();