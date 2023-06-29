const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");
const validateRegisterInput = require("../../../validation/register");
const validateLoginInput = require("../../../validation/login");
const User = require("./user.model");

function handleError(res, err) {
    return res.send(500, err);
}

exports.registerUser = (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const { password, email, name } = req.body;
            const newUser = new User({
                name,
                email,
                password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
};

exports.loginUser = (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.name
                };

                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
};

exports.show = function (req, res) {
    User.findById(req.user._id).exec(function (err, user) {
        if (err) {
            return handleError(res, err);
        }

        if (!user) {
            return res.send(404);
        }

        return res.json(user);
    });
};

exports.get_by_id = function (req, res) {
    const id  = req.params.id;
    User.findById(id, function (err, ad) {
        if (err) {
            return handleError(res, err);
        }
        if (!ad) {
            return res.send(404);
        }
        return res.json(200, ad);
    });
};
