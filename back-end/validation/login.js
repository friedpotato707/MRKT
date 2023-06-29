const validator = require("validator");
const is_empty = require("is-empty");

module.exports = function validateLoginInput(data) {
    let errors = {};
    data.email = !is_empty(data.email) ? data.email : "";
    data.password = !is_empty(data.password) ? data.password : "";

    if (validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    return {
        errors,
        isValid: is_empty(errors),
    };
};
