const prisma = require("../db/prismadb");

const getUser = [
  async (req, res) => {
    try {
      const { userId } = req.params;
      const userIdAsNumber = Number(userId);
      const user = await prisma.user.findUnique({
        where: {
          id: userIdAsNumber,
        },
      });
      if (!user) {
        res.status(400).json({ error: "User not found" });
      }

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
      console.log(req.body);

      const user = await prisma.user.create({
        data: {
          username,
          password,
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
  async (req, res) => {
    try {
      const { userId } = req.params;
      const userIdAsNumber = Number(userId);
      const { username, password } = req.body;

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
  async (req, res) => {
    try {
      const { userId } = req.params;
      const userIdAsNumber = Number(userId);

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
