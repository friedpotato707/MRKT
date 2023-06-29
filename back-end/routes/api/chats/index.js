const express = require("express");
const controller = require("./chat.controller");

const router = express.Router();

router.get("/", controller.get_for_users);

module.exports = router;
