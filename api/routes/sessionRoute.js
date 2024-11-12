const express = require("express");
const sessionController = require("../controllers/commentController");
const router = express.Router();

router.post("/", sessionController.createSession);

router.delete("/", sessionController.deleteSession);

module.exports = router;
