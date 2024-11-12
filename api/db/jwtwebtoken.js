const jwt = require("jsonwebtoken");

const generateToken = (req, res) => {
  jwt.sign({ user: req.user }, process.env.SECRET_KEY, (err, token) => {
    res.json({
      message: "Login successful",
      token,
    });
  });
};

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403).json({ error: "Access forbidden: No token provided." });
  }
};

module.exports = { generateToken, verifyToken };
