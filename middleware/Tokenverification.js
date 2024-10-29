const jwt = require("jsonwebtoken");
const { token } = require("morgan");

function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Access Denied" });
  }
  try {
    const decoded = jwt.verify(token, "sajak");
    req.userId = decoded.User;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid authHeader" });
  }
}

module.exports = verifyToken;
