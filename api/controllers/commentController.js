const prisma = require("../db/prismadb");

const getComment = [
  async (req, res) => {
    const { commentId } = req.params;
    const commentIdAsNumber = Number(commentId);
    try {
      const comment = await prisma.comment.findUnique({
        where: {
          id: commentIdAsNumber,
        },
      });

      if (!comment) return res.status(400).json({ error: "Comment not found" });

      return res.status(200).json(comment);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

const createComment = [
  async (req, res) => {
    const { content, postId, authorId } = req.body;
    const postIdAsNum = Number(postId);
    const authorIdAsNum = Number(authorId);
    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          authorId: authorIdAsNum,
          postId: postIdAsNum,
        },
      });

      return res.status(201).json(comment);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

const updateComment = [
  async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const commentIdAsNumber = Number(commentId);
    try {
      const comment = await prisma.comment.update({
        where: {
          id: commentIdAsNumber,
        },
        data: { content },
      });

      res.status(200).json(comment);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

const deleteComment = [
  async (req, res) => {
    const { commentId } = req.params;
    const commentIdAsNumber = Number(commentId);
    try {
      await prisma.comment.delete({
        where: {
          id: commentIdAsNumber,
        },
      });

      return res
        .status(200)
        .json({ message: `Comment ${commentIdAsNumber} deleted` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

module.exports = { getComment, createComment, updateComment, deleteComment };
