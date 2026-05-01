const jwt = require("jsonwebtoken")
const User = require("../models/User")

module.exports = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) return res.status(401).json({ success: false, message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            _id: decoded.id,
            role: decoded.role
        };
        next()
    } catch {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
}
