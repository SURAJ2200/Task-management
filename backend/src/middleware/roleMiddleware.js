exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Not authorized as an admin" });
  }
};

exports.isMember = (req, res, next) => {
  if (req.user && req.user.role === "member") {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Not authorized as a member" });
  }
};
