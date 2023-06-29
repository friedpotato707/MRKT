const express = require("express");
const controller = require("./message.controller");
const multer = require('multer');

const router = express.Router();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({
    storage: storage,
    dest: 'images',
    limits: {
        fileSize: 100000000,
    },
});

router.get("/", controller.get_for_users);
router.post("/", upload.single('file'), controller.create);

module.exports = router;
