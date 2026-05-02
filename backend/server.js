require("dotenv").config();

const path = require("path");
const express = require("express");
const app = require("./src/app");       
const connectDb = require("./src/config/database");

connectDb.connect();

const PORT = process.env.PORT || 5000;


const frontendPath = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendPath));


app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});


app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});