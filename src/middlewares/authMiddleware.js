// Optional middleware for later phases.
// For now, this file is only a placeholder so beginners can later add JWT auth.
const jwt = require("jsonwebtoken");
const User = require("../models/User")


const authenticate = async (req, res, next) => {
  // TODO: Read token from Authorization header and verify user.
  try {


    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required",
        data: null,
      });
    }

    // "Bearer argnhyuijhg-cxcsu.kuhqkhkgchjgckjwdbckj"

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      data: null,
    });
  }
};

module.exports = { authenticate };
