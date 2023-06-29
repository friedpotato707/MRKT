const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        // date when user joined
        date: {
            type: Date,
            default: Date.now
        },
        // list of ads created by user
        ads: [{ type: Schema.ObjectId, ref: "Ad" }],
    }
);

module.exports = User = mongoose.model("User", UserSchema);
