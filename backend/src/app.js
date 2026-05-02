require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.status(200).send("Backend Working 🚀");
});


app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});


try {
  const authRoutes = require("./src/routes/authRoutes");
  const projectRoutes = require("./src/routes/projectRoutes");
  const taskRoutes = require("./src/routes/taskRoutes");

  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/tasks", taskRoutes);

} catch (err) {
  console.error("Route loading error:", err.message);
}


app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ error: "Something broke!" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});