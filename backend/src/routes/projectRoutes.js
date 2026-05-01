const express = require("express");
const auth = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const {
  createProject,
  getProjects,
  addMember,
  removeMember,
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", auth, isAdmin, createProject);
router.get("/", auth, getProjects);
router.post("/:projectId/members", auth, isAdmin, addMember);
router.delete("/:id/remove-member/:userId", auth, isAdmin, removeMember);

module.exports = router;
