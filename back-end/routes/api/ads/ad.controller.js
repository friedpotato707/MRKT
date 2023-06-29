const Ad = require("./ad.model").Ad;
const _ = require("lodash");
const { addListener } = require("nodemon");
const ObjectID = require('mongodb').ObjectID;

function handleError(res, err) {
    return res.send(500, err);
}

// Get list of ads
exports.index = function (req, res) {
    Ad.find(function (err, ads) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, ads);
    }).populate("owner", "_id name");
};

// Get ads created by specific user
exports.get_for_user = function (req, res) {
    const id  = req.params.id;
    Ad.find({ owner: ObjectID(id) })
        .populate("owner", "_id name")
        .exec(function (err, ads) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, ads);
        });
};

// Get ad by id
exports.get_by_id = function (req, res) {
    const id  = req.params.id;
    Ad.findById(id, function (err, ad) {
        if (err) {
            return handleError(res, err);
        }
        if (!ad) {
            return res.send(404);
        }
        return res.json(200, ad);
    }).populate("owner", "_id name");
};

// create new ad
exports.create = function (req, res) {
    Ad.create(
        {
            ...req.body,
            owner: req.body.userId,
            img: { buf: req.body.selectedImage, format: req.body.imageFormat },
        }, function (err, ad) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(201);
        });
};

// update existing ad
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Ad.findById(req.params.id, function (err, ad) {
        if (err) {
            return handleError(res, err);
        }
        if (!ad) {
            return res.send(404);
        }
        const updated = _.merge(addListener, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }

            return res.json(200);
        });
    });
};

// delete ad
exports.destroy = function (req, res) {
    Ad.findById(req.params.id, function (err, ad) {
        if (err) {
            return handleError(res, err);
        }
        if (!ad) {
            return res.send(404);
        }
        ad.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};
