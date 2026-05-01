const mongoose = require("mongoose");
const Project = require("../models/Projects");
const User = require("../models/User");

exports.createProject = async (req, res) => {
    try {
        const { name, description, members } = req.body;

        const project = await Project.create({
            name,
            description,
            members,
            createdBy: req.user._id,
        });

        res.status(201).json({ success: true, message: "Project created successfully", data: project });

    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

exports.getProjects = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { members: req.user._id };
        const projects = await Project.find(query).populate("members", "name email");

        res.json({ success: true, message: "Projects retrieved successfully", data: projects });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });

    }
}

exports.addMember = async (req, res) => {
    try {

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID, Email, or Name is required" });
        }
        let userToFind;
        const isObjectId = mongoose.Types.ObjectId.isValid(userId);

        if (isObjectId) {
            userToFind = await User.findById(userId);
        }

        if (!userToFind) {
            userToFind = await User.findOne({
                $or: [
                    { email: userId },
                    { name: { $regex: new RegExp(`^${userId}$`, "i") } } 
                ]
            });
        }

        if (!userToFind) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Only the project admin can add members" });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.projectId,
            { $addToSet: { members: userToFind._id } },
            { new: true }
        ).populate("members", "name email");

        res.json({ success: true, message: "Member added successfully", data: updatedProject });

    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

exports.removeMember = async (req, res) => {
    try {
        const { userId } = req.params;
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        project.members = project.members.filter(member => member.toString() !== userId);
        await project.save();
        res.json({ success: true, message: "Member removed successfully", data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
