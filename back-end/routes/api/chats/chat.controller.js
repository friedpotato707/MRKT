const _ = require("lodash");
const ObjectID = require('mongodb').ObjectID;
const Chat = require("./chat.model").Chat;

function handleError(res, err) {
    console.log(err);
    return res.send(500, err);
}

exports.get_for_users = function (req, res) {
    var query = require('url').parse(req.url, true).query;
    const userId = ObjectID(query.userId);

    Promise.all([
        Chat.findOne(
            {
                user1: userId,
            })
            .populate("chat.lastMessage")
            .populate("lastMessageSender", "name _id")
            .populate("ad", "name _id")
            .populate("user1", "name _id")
            .populate("user2", "name _id"),
        Chat.findOne(
            {
                user2: userId,
            })
            .populate("chat.lastMessage")
            .populate("lastMessageSender", "name _id")
            .populate("ad", "name _id")
            .populate("user1", "name _id")
            .populate("user2", "name _id"),
    ]).then(chats => {
        return res.json(200, chats.filter(chat => chat !== null));
    }).catch(err => {
        handleError(res, err);
    });
};
