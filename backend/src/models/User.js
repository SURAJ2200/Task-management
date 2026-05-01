const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
}, { timestamps: true });

userSchema.pre("save", function () {
  console.log(" PRE-SAVE role:", this.role);
});

module.exports = mongoose.model("User", userSchema);
