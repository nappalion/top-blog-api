const jwt = require("jsonwebtoken");

const generateToken = (req, res, next) => {
  return jwt.sign(
    { id: req.user.id, username: req.user.username },
    process.env.SECRET_KEY,
    { expiresIn: "1h" },
    (err, token) => {
      return res.json({
        message: "Login successful",
        token,
      });
    }
  );
};

module.exports = { generateToken };
