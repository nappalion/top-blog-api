const prisma = require("../db/prismadb");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const getUser = [
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const userIdAsNumber = Number(userId);
      const user = await prisma.user.findUnique({
        where: {
          id: userIdAsNumber,
        },
      });
      if (!user) return res.status(400).json({ error: "User not found" });

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

const createUser = [
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
        select: {
          id: true,
        },
      });

      return res.status(201).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

const updateUser = [
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const userIdAsNumber = Number(userId);
      const { username, password } = req.body;

      if (req.user.id !== userIdAsNumber) {
        return res
          .status(403)
          .json({ error: "Unauthorized: You cannot edit this user." });
      }

      const newData = {};
      if (username) newData.username = username;
      if (password) newData.password = password;

      const user = await prisma.user.update({
        where: { id: Number(userIdAsNumber) },
        data: newData,
      });

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

const deleteUser = [
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const userIdAsNumber = Number(userId);

      if (req.user.id !== userIdAsNumber) {
        return res
          .status(403)
          .json({ error: "Unauthorized: You cannot delete this user." });
      }

      await prisma.user.delete({
        where: { id: userIdAsNumber },
      });

      return res
        .status(200)
        .json({ message: `User ${userIdAsNumber} deleted` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

module.exports = { getUser, createUser, updateUser, deleteUser };
