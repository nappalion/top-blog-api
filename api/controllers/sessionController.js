const passport = require("passport");
const { generateToken } = require("../db/jwtwebtoken");

const createSession = [
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "An error occurred during authentication." });
      }
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password." });
      }

      req.user = user;

      return generateToken(req, res, next);
    })(req, res, next);
  },
];

module.exports = { createSession };
