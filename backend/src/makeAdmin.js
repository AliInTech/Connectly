import mongoose from "mongoose";
import { User } from "./models/user.model.js";
import bcrypt from "bcrypt";

const MONGO_URI = "mongodb+srv://imdigitalashish:imdigitalashish@cluster0.cujabk4.mongodb.net/"; 

const createAdminUser = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to Database successfully!");

        // Naye admin user ki details:
        const adminData = {
            name: "Admin User",
            username: "admin",      // Log in karne ke liye Username
            password: "adminpassword" // Log in karne ke liye Password
        };

        // Check agar ye username pehle se exist karta hai
        const existingUser = await User.findOne({ username: adminData.username });
        
        if (existingUser) {
            existingUser.role = "admin";
            await existingUser.save();
            console.log(`✅ SUCCESS: Existing User '${adminData.username}' ko Admin role de diya gaya hai!`);
        } else {
            // Secret Password Hash karein
            const hashedPassword = await bcrypt.hash(adminData.password, 10);
            
            const newAdmin = new User({
                name: adminData.name,
                username: adminData.username,
                password: hashedPassword,
                role: "admin"
            });

            await newAdmin.save();
            console.log(`✅ SUCCESS: Naya Admin User Ban Gaya!`);
            console.log(`Username: ${adminData.username}`);
            console.log(`Password: ${adminData.password}`);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

createAdminUser();