const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/:userId", userController.getUser);

router.post("/", userController.createUser);

router.delete("/:userId", userController.deleteUser);

router.put("/:userId", userController.updateUser);

module.exports = router;
