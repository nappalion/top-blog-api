const prisma = require("../db/prismadb");

const getCommentsByPostId = [
  async (req, res) => {
    const postId = Number(req.params.postId);
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    try {
      const comments = await prisma.comment.findMany({
        where: {
          postId,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!comments || comments.length === 0) {
        return res.status(404).json({ error: "No comments found" });
      }

      return res.status(200).json(comments);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

const getCommentById = [
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
      const foundComment = await prisma.comment.findUnique({
        where: {
          id: commentIdAsNumber,
        },
      });

      if (!foundComment)
        return res.status(400).json({ error: "Comment not found" });

      if (req.user.id !== foundComment.authorId) {
        return res
          .status(403)
          .json({ error: "Unauthorized: You cannot edit this comment." });
      }

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
      const comment = await prisma.comment.findUnique({
        where: {
          id: commentIdAsNumber,
        },
      });

      if (!comment) return res.status(400).json({ error: "Comment not found" });

      if (req.user.id !== comment.authorId) {
        return res
          .status(403)
          .json({ error: "Unauthorized: You cannot edit this comment." });
      }

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

module.exports = {
  getCommentsByPostId,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
