const prisma = require("../db/prismadb");

const getPost = [
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
    const { title, content, published, authorId } = req.body;
    const postIdAsNumber = Number(postId);
    try {
      const newData = {};
      if (title) newData.title = title;
      if (content) newData.content = content;
      if (published) newData.published = published;
      if (authorId) newData.authorId = authorId;

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

module.exports = { getPost, createPost, updatePost, deletePost };
