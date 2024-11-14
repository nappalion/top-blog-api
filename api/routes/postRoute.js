const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.get("/author/:authorId", postController.getPostsByAuthorId);

router.get("/post/:postId", postController.getPostById);

router.get("/", postController.getPosts);

router.post("/", postController.createPost);

router.delete("/:postId", postController.deletePost);

router.put("/:postId", postController.updatePost);

module.exports = router;
