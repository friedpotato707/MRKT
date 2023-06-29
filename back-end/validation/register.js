const validator = require("validator");
const is_empty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};
    data.name = !is_empty(data.name) ? data.name : "";
    data.email = !is_empty(data.email) ? data.email : "";
    data.password = !is_empty(data.password) ? data.password : "";
    data.password2 = !is_empty(data.password2) ? data.password2 : "";

    if (validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    if (validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }

    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }

    if (!validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }

    return {
        errors,
        isValid: is_empty(errors)
    };
};
