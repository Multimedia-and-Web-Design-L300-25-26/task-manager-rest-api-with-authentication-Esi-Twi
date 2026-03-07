import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks - Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate input
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Create task with authenticated user as owner
    const task = new Task({
      title,
      description,
      owner: req.user._id,
    });

    await task.save();

    res.status(201).json(task);

  } catch (error) {
    return res.status(500).json({ error: "Failed to create task" });
  }
});

// GET /api/tasks - Return only tasks belonging to authenticated user
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.status(200).json(tasks);
    
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

// DELETE /api/tasks/:id - Delete task only if user is owner
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check ownership
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized: You can only delete your own tasks" });
    }

    // Delete task
    await Task.findByIdAndDelete(id);

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;