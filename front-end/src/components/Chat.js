import React, { useState, useEffect } from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import dateFormat from "dateformat";
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import LoadingScreen from "./LoadingScreen";

const MAX_LENGTH_TEXT = 100;

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
}));

const Chat = props => {
    const classes = useStyles();
    const params = useParams();
    const [state, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [ad, setAd] = useState(null);
    const [doneLoading, setDoneLoading] = useState(false);
    const [updateTimerSet, setUpdateTimerStatus] = useState(false);
    const userId = params.userId;

    const fetchAdInfo = async () => {
        const request = new Request("http://localhost:5000/api/ads/" + params.adId, {
            method: "GET",
            headers: {
            },
        });
        const response = await fetch(request);
        const data = await response.json();
        setAd(data ? data : null);
    }

    const fetchMessages = async (user) => {
        let request = new Request('http://localhost:5000/api/messages?' + new URLSearchParams({
            senderId: props.auth.user.id,
            receiverId: user._id,
            adId: params.adId,
        }), {
            method: "GET",
            headers: {
            },
        },
        );
        let response = await fetch(request);
        let data = await response.json();

        request = new Request('http://localhost:5000/api/messages?' + new URLSearchParams({
            receiverId: props.auth.user.id,
            senderId: user._id,
            adId: params.adId,
        }), {
            method: "GET",
            headers: {
            },
        },
        );
        response = await fetch(request);
        let data2 = await response.json();
        data = data.concat(data2);

        for (let i = 0; i < data.length; i++) {
            data[i].date = Date.parse(data[i].date);
        }

        function compare(a, b) {
            return a.date - b.date;
        }

        data.sort(compare)
        setMessages(data);
        setDoneLoading(true);
    }

    const fetchTargetUserData = async () => {
        const request = new Request("http://localhost:5000/api/users/" + userId, {
            method: "GET",
            headers: {
            },
        });
        const response = await fetch(request);
        const data = await response.json();
        setUser(data);
        fetchMessages(data)
            .catch(console.error);
    }

    useEffect(() => {
        fetchAdInfo()
            .catch(console.error);

        fetchTargetUserData()
            .catch(console.error);
    }, [state])

    useEffect(() => { }, [messages])

    function handleSubmit(e) {
        e.preventDefault();
        const url = "http://localhost:5000/api/messages";
        const formData = new FormData();
        formData.append('text', text);
        formData.append('senderId', props.auth.user.id);
        formData.append('receiverId', user._id);
        formData.append('adId', params.adId);
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Connection': 'keep-alive',
                'Accept': '*/*',
            }
        }
        axios.post(url, formData, config).then((response) => {
            setText("");
            forceUpdate();
        }).catch((error) => {
            window.alert("Something went wrong. Please try again.");
        });
    }

    if (!updateTimerSet && user) {
        const updatePostInfo = setInterval(function () {
            fetchMessages(user)
                .catch(console.error);
            setUpdateTimerStatus(true);
            return () => clearInterval(updatePostInfo);
        }, 3000);
    }

    return (
        <React.Fragment>
            <Container maxWidth="md">
                {!doneLoading ? <LoadingScreen /> : <React.Fragment>
                    <br />
                    {ad && user && <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
                        <b>{"Your conversation with " + user.name + " for ad '" + ad.name + "'"}</b>
                    </Typography>}
                    <br />
                    <Box
                        className={classes.box}
                        component="form"
                        sx={{
                            "& .MuiTextField-root": { width: "100%", pl: 1, pr: 1, mb: 1, },
                        }}
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <Grid container component={Paper} className={classes.chatSection}>
                            <Grid item xs={12}>
                                <List className={classes.messageArea}>
                                    {messages.map((msg, index) => (
                                        <ListItem key={"msg_" + index}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <ListItemText align={msg.sender._id === props.auth.user.id ? "left" : "right"} primary={msg.text}></ListItemText>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <ListItemText align={msg.sender._id === props.auth.user.id ? "left" : "right"} secondary={dateFormat(msg.date, "dddd, mmmm dS, yyyy, h:MM:ss TT")}></ListItemText>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid container style={{ padding: '20px' }}>
                                <Grid item xs={11}>
                                    <TextField
                                        placeholder="Type your message here"
                                        inputProps={{
                                            maxLength: MAX_LENGTH_TEXT,
                                            style: {
                                                paddingLeft: 10,
                                            }
                                        }}
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        fullWidth />
                                </Grid>
                                <Grid align="right">
                                    <Fab type="submit" aria-label="add"><SendIcon /></Fab>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </React.Fragment>}
            </Container>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, null)(Chat);
