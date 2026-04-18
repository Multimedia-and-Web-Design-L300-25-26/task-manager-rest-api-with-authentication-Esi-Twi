import express from "express";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Default route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Task Manager API is running",
    });
});

const mongoURI =
    process.env.NODE_ENV === "test"
        ? "mongodb://localhost:27017/TASK-MANAGER"
        : process.env.MONGO_URI;


mongoose
    .connect(mongoURI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Start server ONLY if not running tests
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}


export default app;