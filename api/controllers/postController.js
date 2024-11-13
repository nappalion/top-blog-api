const prisma = require("../db/prismadb");

const getPosts = [
  async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    try {
      const posts = await prisma.post.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!posts || posts.length === 0) {
        return res.status(404).json({ error: "No posts found" });
      }

      return res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

const getPostById = [
  async (req, res) => {
    const { postId } = req.params;
    const postIdAsNumber = Number(postId);

    try {
      const post = await prisma.post.findUnique({
        where: {
          id: postIdAsNumber,
        },
      });

      if (!post) return res.status(400).json({ error: "Post not found" });

      return res.status(200).json(post);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

const createPost = [
  async (req, res) => {
    const { title, content, published, authorId } = req.body;
    const authorIdAsNum = Number(authorId);
    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          published,
          authorId: authorIdAsNum,
        },
      });

      return res.status(201).json(post);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

const updatePost = [
  async (req, res) => {
    const { postId } = req.params;
    const { title, content, published } = req.body;
    const postIdAsNumber = Number(postId);

    try {
      const foundPost = await prisma.post.findUnique({
        where: {
          id: postIdAsNumber,
        },
      });

      if (!foundPost) return res.status(400).json({ error: "Post not found" });

      if (req.user.id !== foundPost.authorId) {
        return res
          .status(403)
          .json({ error: "Unauthorized: You cannot edit this post." });
      }

      const newData = {};
      if (title) newData.title = title;
      if (content) newData.content = content;
      if (published) newData.published = published;

      const post = await prisma.post.update({
        where: {
          id: postIdAsNumber,
        },
        data: newData,
      });

      res.status(200).json(post);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

const deletePost = [
  async (req, res) => {
    const { postId } = req.params;
    const postIdAsNumber = Number(postId);

    try {
      const post = await prisma.post.findUnique({
        where: {
          id: postIdAsNumber,
        },
      });

      if (!post) return res.status(400).json({ error: "Post not found" });

      if (req.user.id !== post.authorId) {
        return res
          .status(403)
          .json({ error: "Unauthorized: You cannot delete this post." });
      }

      await prisma.post.delete({
        where: {
          id: postIdAsNumber,
        },
      });

      return res
        .status(200)
        .json({ message: `Post ${postIdAsNumber} deleted` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
];

module.exports = { getPostById, getPosts, createPost, updatePost, deletePost };
