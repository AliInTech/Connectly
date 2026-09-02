import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManager.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000));

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// Routes setup
app.use("/api/v1/users", userRoutes);

const start = async () => {
    try {
        // DB Name '/connectly' yahan zaroori hai
        const connectionDb = await mongoose.connect(
            "mongodb+srv://imdigitalashish:imdigitalashish@cluster0.cujabk4.mongodb.net/connectly?retryWrites=true&w=majority"
        );
        console.log(`MONGO DB Connected Host: ${connectionDb.connection.host}`);
        
        server.listen(app.get("port"), () => {
            console.log(`LISTENIN ON PORT ${app.get("port")}`);
        });
    } catch (error) {
        console.log("DB Connection Error:", error);
    }
};

start();