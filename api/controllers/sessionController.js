const prisma = require("../db/prismadb");
const passport = require("passport");
const jwtwebtoken = require("../db/jwtwebtoken");

const createSession = [
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred during authentication." });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    next();
  }),
  jwtwebtoken.generateToken,
];

const deleteSession = [(req, res) => {}];

module.exports = { createSession, deleteSession };
