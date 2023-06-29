const Message = require("./message.model").Message;
const _ = require("lodash");
const ObjectID = require('mongodb').ObjectID;
const Chat = require("../chats/chat.model").Chat;

function handleError(res, err) {
    console.log(err);
    return res.send(500, err);
}

exports.get_for_users = function (req, res) {
    var query = require('url').parse(req.url, true).query;
    const senderId = query.senderId;
    const receiverId = query.receiverId;
    const adId = query.adId;
    Message.find(
        {
            sender: ObjectID(senderId),
            receiver: ObjectID(receiverId),
            ad: ObjectID(adId),
        })
        .sort({ date: -1 })
        .populate("sender", "_id name")
        .populate("receiver", "_id name")
        .exec(function (err, messages) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, messages);
        });
};

exports.create = function (req, res) {
    function createNewChat(){
        // first create chat, then create message
        Chat.create(
            {
                user1: req.body.senderId,
                user2: req.body.receiverId,
                lastMessage: req.body.text,
                lastMessageSender: req.body.senderId,
                ad: ObjectID(req.body.adId),
            }
        ).then(newChat => {
            Message.create(
                {
                    text: req.body.text,
                    sender: req.body.senderId,
                    receiver: req.body.receiverId,
                    ad: req.body.adId,
                    chat: newChat._id,
                }, function (err, message) {
                    if (err) {
                        return handleError(res, err);
                    }
                    return res.json(201);
                }
            );
        })
        .catch(err => {
            return handleError(res, err);
        });
    };

    function findChatWithUser2Owner(){ 
        Chat.findOne(
            {
                user2: ObjectID(req.body.senderId),
                user1: ObjectID(req.body.receiverId),
                ad: ObjectID(req.body.adId),
            })
            .then(chat2 => {
                if (chat2 !== null) {
                    // we found chat, create messaage record
                    chatFound = true;
                    Message.create(
                        {
                            text: req.body.text,
                            sender: req.body.senderId,
                            receiver: req.body.receiverId,
                            ad: req.body.adId,
                            chat: chat2._id,
                        }
                    )
                    .catch(err => {
                        return handleError(res, err);
                    })
                    .then(message => {
                        // update last message and last message sender of the chat
                        Chat.updateOne({ _id: chat2._id },
                            { lastMessage: req.body.text, lastMessageSender: req.body.senderId },
                            function (err, updatedChat) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    return res.json(201);
                                }
                            }
                        );
                    });
                } else {
                    createNewChat();
                }
            })
            .catch(err => {
                return handleError(res, err);
            });
    };
    
    function findChatWithUser1Owner(){
        Chat.findOne(
            {
                user1: ObjectID(req.body.senderId),
                user2: ObjectID(req.body.receiverId),
                ad: ObjectID(req.body.adId),
            })
            .then(chat1 => {
                if (chat1 !== null) {
                    // we found chat, create messaage record
                    Message.create(
                        {
                            text: req.body.text,
                            sender: req.body.senderId,
                            receiver: req.body.receiverId,
                            ad: req.body.adId,
                            chat: chat1._id,
                        }
                    )
                    .then(message => {
                        // update last message and last message sender of the chat
                        Chat.updateOne({ _id: chat1._id },
                            { lastMessage: req.body.text, lastMessageSender: req.body.senderId },
                            function (err, updatedChat) {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    return res.json(201);
                                }
                            }
                        );
                    })
                    .catch(err => {
                        return handleError(res, err);
                    });
                } else {
                    findChatWithUser2Owner();
                }
            })
            .catch(err => {
                return handleError(res, err);
            });
    };

    findChatWithUser1Owner();
};
