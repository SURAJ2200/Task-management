const Task = require("../models/Task");
const Project = require("../models/Projects");
exports.createTask = async (req, res) => {
    try {
        console.log("CREATING TASK:", req.body);
        const { title, description, assignedTo, projectId, dueDate } = req.body;

        const projectDoc = await Project.findById(projectId);
        if (!projectDoc) {
            console.log("Project not found:", projectId);
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        const isMember = projectDoc.members.some(m => m.toString() === assignedTo);
        if (!isMember) {
            console.log("User not member of project. User:", assignedTo, "Members:", projectDoc.members);
            return res.status(400).json({ success: false, message: "Assigned user is not a member of this project" });
        }

        const task = await Task.create({
            title,
            description,
            assignedTo,
            projectId,
            dueDate,
            createdBy: req.user._id,
            status: "pending"
        });

        console.log("TASK CREATED SUCCESSFULLY:", task._id);
        res.status(201).json({ success: true, message: "Task created successfully", data: task });
    } catch (err) {
        console.error("TASK CREATION ERROR:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getTasks = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'admin') {
            const projects = await Project.find({ createdBy: req.user._id });
            const projectIds = projects.map(p => p._id);
            query = { projectId: { $in: projectIds } };
        } else {
            query = { assignedTo: req.user._id };
        }

        const tasks = await Task.find(query)
            .populate("projectId", "name")
            .populate("assignedTo", "name email");

        res.json({ success: true, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate("projectId", "name")
            .populate("assignedTo", "name");
        res.json({ success: true, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "in-progress", "completed"];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        if (req.user.role === 'member' && task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You can only update your own tasks" });
        }

        task.status = status;
        await task.save();

        res.json({ success: true, message: "Task status updated", data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getDashboard = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'admin') {
            const projects = await Project.find({ createdBy: req.user._id });
            const projectIds = projects.map(p => p._id);
            query = { projectId: { $in: projectIds } };
        } else {
            query = { assignedTo: req.user._id };
        }

        const tasks = await Task.find(query);
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === "completed").length;
        const pending = tasks.filter(t => t.status === "pending").length;
        const inProgress = tasks.filter(t => t.status === "in-progress").length;
        const overdue = tasks.filter(
            t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed").length;

        res.json({
            success: true,
            data: {
                total,
                completed,
                pending,
                inProgress,
                overdue,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });
        
        await Task.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ projectId: req.params.projectId })
            .populate("projectId", "name")
            .populate("assignedTo", "name");
        res.json({ success: true, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
