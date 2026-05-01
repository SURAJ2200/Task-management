require("dotenv").config();
const app = require("./src/app")
const connectDb = require("./src/config/database")

connectDb.connect();
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT} - VERSION 2.0`)
})
