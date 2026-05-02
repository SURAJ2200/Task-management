require("dotenv").config();

const app = require("./src/app");
const { connect } = require("./src/config/database");

const PORT = process.env.PORT || 8080;

// Connect to Database
connect();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});