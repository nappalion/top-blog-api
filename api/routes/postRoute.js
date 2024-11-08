const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.get("/:postId", postController.getPost);

router.post("/", postController.createPost);

router.delete("/:postId", postController.deletePost);

router.put("/:postId", postController.updatePost);

module.exports = router;
