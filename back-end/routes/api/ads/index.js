const express = require("express");
const controller = require("./ad.controller");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Ad = require("./ad.model").Ad;

const router = express.Router();
let FILE = undefined;

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
    fileFilter(req, file, cb) {
        FILE = file;
        if (!file.originalname.match("(.*/)*.+\\.(png|jpg|gif|bmp|jpeg|PNG|JPG|GIF|BMP|JPEG)$")) {
            cb(new Error('Please upload an image.'))
        }
        cb(undefined, true)
    }
});

router.get("/", controller.index);
router.get("/:id", controller.get_by_id);
router.get("/user/:id", controller.get_for_user);
router.put("/:id", controller.update);
router.patch("/:id", controller.update);
router.delete("/:id", controller.destroy);

router.post('/', upload.single('file'), (req, res) => {
    Ad.create(
        {
            ...req.body,
            owner: req.body.userId,
            img: {
                data: fs.readFileSync(path.join('uploads/' + req.file.filename))
            }
        }, function (err, ad) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(201, ad);
        });

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

module.exports = router;
