require("dotenv").config();

const app = require("./src/app");
const connectDb = require("./src/config/database");

connectDb.connect();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Backend Working 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});