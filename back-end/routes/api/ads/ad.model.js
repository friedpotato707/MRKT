const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdImgSchema = mongoose.Schema({
    data: Buffer,
    format: String,
});

const AdSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        userLocation: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        owner: {
            type: Schema.ObjectId,
            ref: "User",
            required: true,
        },
        img: {
            data: Buffer
        },
    }
);

exports.Ad = mongoose.model("Ad", AdSchema);
exports.schema = AdSchema;
exports.AdImg = mongoose.model("AdImg", AdImgSchema);
