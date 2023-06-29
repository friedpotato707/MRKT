const controller = require("./user.controller");

const express = require("express");
const router = express.Router();

router.get("/", controller.show);
router.get("/:id", controller.get_by_id);
router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);

module.exports = router;
