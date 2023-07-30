// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
   const token = req.header("Authorization").split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Authorization denied, token missing" });
    }

    const decodedToken = jwt.verify(token, "your_secret_key");
    req.user = { userId: decodedToken.userId };

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Authorization denied, invalid token" });
  }
};
