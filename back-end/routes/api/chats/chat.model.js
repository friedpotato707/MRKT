const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema(
    {
        user1: {
            type: Schema.ObjectId,
            ref: "User",
            required: true,
        },
        user2: {
            type: Schema.ObjectId,
            ref: "User",
            required: true,
        },
        ad: {
            type: Schema.ObjectId,
            ref: "Ad",
            required: true,
        },
        lastMessage: {
            type: String,
            required: true
        },
        lastMessageSender: {
            type: Schema.ObjectId,
            ref: "User",
            required: true,
        },
    }
);

exports.Chat = mongoose.model("Chat", ChatSchema);
exports.schema = ChatSchema;
