require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ Error:", error));

// Import models
const Task = require("./models/Task");
const Session = require("./models/Session");

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "FocusTools API",
    status: "Running",
    endpoints: {
      tasks: "/api/tasks",
      sessions: "/api/sessions",
    },
  });
});

//
// ====== TASK ROUTES ======
//

// CREATE
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, completed } = req.body;

    const task = new Task({
      title,
      completed, 
    });

    const savedTask = await task.save();
    return res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.message,
      });
    }
    return res.status(500).json({ error: "Server error" });
  }
});

// READ ALL
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// READ ONE
app.get("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// UPDATE
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.message,
      });
    }
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

//
// ====== SESSION ROUTES ======
//

// POST
app.post("/api/sessions", async (req, res) => {
  try {
    const { taskId, duration, startTime, completed } = req.body;

    const session = new Session({
      taskId,
      duration,
      startTime,
      completed, // optional; defaults to true
    });

    const savedSession = await session.save();
    return res.status(201).json(savedSession);
  } catch (error) {
    console.error("Error creating session:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.message,
      });
    }
    return res.status(500).json({ error: "Server error" });
  }
});

// READ ALL
app.get("/api/sessions", async (req, res) => {
  try {
    const sessions = await Session.find();

    return res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
