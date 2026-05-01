const mongoose = require("mongoose");
const Task = require("./src/models/Task");
const Project = require("./src/models/Projects");
const User = require("./src/models/User");
require("dotenv").config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const tasks = await Task.find().populate("projectId").populate("assignedTo").populate("createdBy");
    console.log(`Found ${tasks.length} tasks:`);
    tasks.forEach((t, i) => {
      console.log(`--- Task ${i+1} ---`);
      console.log(`Title: ${t.title}`);
      console.log(`Project: ${t.projectId?.name} (ID: ${t.projectId?._id})`);
      console.log(`Assigned To: ${t.assignedTo?.name} (ID: ${t.assignedTo?._id})`);
      console.log(`Created By: ${t.createdBy?.name} (ID: ${t.createdBy?._id})`);
      console.log(`Status: ${t.status}`);
    });

    const projects = await Project.find();
    console.log(`\nFound ${projects.length} projects:`);
    projects.forEach(p => console.log(`- ${p.name} (ID: ${p._id}, CreatedBy: ${p.createdBy})`));

    const users = await User.find();
    console.log(`\nFound ${users.length} users:`);
    users.forEach(u => console.log(`- ${u.name} (ID: ${u._id}, Role: ${u.role})`));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
