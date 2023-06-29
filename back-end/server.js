const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const ads = require("./routes/api/ads");
const messages = require("./routes/api/messages");
const chats = require("./routes/api/chats");
const users = require("./routes/api/user");
const db = require("./config/keys").mongoURI;

const app = express();
app.appname = "Zeller";

const MAIN_SERVICE_PORT = 5000;

app.use(express.json());

require("./config/passport")(passport);
app.use(passport.initialize());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(express.static(path.join(__dirname, '/public/')));

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB successfully connected"))
    .catch((err) => console.log(err));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.listen(MAIN_SERVICE_PORT, () => console.log(`Server up and running on port ${MAIN_SERVICE_PORT}!`));

app.use("/api/messages", messages);
app.use("/api/chats", chats);
app.use("/api/users", users);
app.use("/api/ads", ads);
