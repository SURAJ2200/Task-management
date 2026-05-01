const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("DB connection Succesfuly"))
    .catch((error)=>{
        console.log("DB connection Failed");
        console.error(error);
        process.exit(1);
        
    })
}
