require("dotenv").config();

const app = require("./src/app");
const connectDb = require("./src/config/database");

const PORT = process.env.PORT || 5000;


connectDb.connect()
  .then(() => {
    console.log("DB Connected");

  
    app.get("/", (req, res) => {
      res.send("API Running 🚀");
    });

   
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.error("DB Failed ", err);
  });