const express = require("express");
const commentController = require("../controllers/commentController");
const router = express.Router();

router.get("/:postId", commentController.getCommentsByPostId);

router.get("/:commentId", commentController.getCommentById);

router.post("/", commentController.createComment);

router.delete("/:commentId", commentController.deleteComment);

router.put("/:commentId", commentController.updateComment);

module.exports = router;
