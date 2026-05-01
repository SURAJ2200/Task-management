const express = require("express");
const auth = require("../middleware/authMiddleware");
const { isAdmin, isMember } = require("../middleware/roleMiddleware");
const {
  createTask,
  getTasks,
  updateTaskStatus,
  getDashboard,
  getTasksByProject,
  deleteTask,
  getMyTasks,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", auth, isAdmin, createTask);
router.get("/", auth, getTasks);
router.get("/my", auth, getMyTasks);
router.get("/project/:projectId", auth, getTasksByProject);
router.patch("/:id", auth, updateTaskStatus);
router.delete("/:id", auth, isAdmin, deleteTask);
router.get("/dashboard", auth, getDashboard);

module.exports = router;
