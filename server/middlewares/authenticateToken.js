// Middleware to authenticate token
const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ result: "Token required" });
  }

  jwt.verify(token, "MYSECRET", (err, authData) => {
    if (err) {
      return res.status(401).json({ result: "Invalid token" });
    }
    req.authData = authData; // Attach authData to request object
    next();
  });
};
module.exports = authenticateToken;
