const User = require("../models/User")
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.signup = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

const { name, email, password, role } = req.body;

console.log("Extracted role:", role, typeof role);

const hashed = await bcrypt.hash(password, 10);
const user = new User({
  name,
  email,
  password: hashed,
  role: role
});

console.log("Before save (doc.role):", user.role);

await user.save();

    res.status(201).json({
      success: true,
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User does not exist" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ success: false, message: "Invalid password" });

  res.json({
    success: true,
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
