const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        text: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        sender: {
            type: Schema.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: Schema.ObjectId,
            ref: "User",
            required: true,
        },
        ad: {
            type: Schema.ObjectId,
            ref: "Ad",
            required: true,
        },
        chat: {
            type: Schema.ObjectId,
            ref: "Chat",
            required: true,
        },
    }
);

exports.Message = mongoose.model("Message", MessageSchema);
exports.schema = MessageSchema;
