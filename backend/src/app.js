const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes")
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

module.exports = app
