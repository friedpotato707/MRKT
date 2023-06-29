import React, { useState, useEffect } from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

const ContactList = props => {
    const [chats, setChats] = useState([1, 2, 3]);
    const [doneLoading, setDoneLoading] = useState(false);

    useEffect(() => {

        const fetchContacts = async (user) => {
            const request = new Request('http://localhost:5000/api/chats?' + new URLSearchParams({
                userId: props.auth.user.id,
            }), {
                method: "GET",
                headers: {
                },
            },
            );
            const response = await fetch(request);
            const data = await response.json();
            setChats(data);
            setDoneLoading(true);
        }
        fetchContacts()
            .catch(console.error);
    }, []);

    return (
        <div>
            <Container maxWidth="md">
                {!doneLoading ? <LoadingScreen /> : <React.Fragment>
                    <br />
                    <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
                        <b>Messages</b>
                    </Typography><br />
                    {chats.map((chat, index) => (
                        <Box sx={{ minWidth: 275 }} key={"chat_" + index}>
                            <Card variant="outlined">
                                <RouterLink to={'/ad/' + chat.ad._id + '/user/' + (chat.user1._id !== props.auth.user.id ? chat.user1._id : chat.user2._id) + '/chat'}>
                                    <CardContent>
                                        <Typography variant="h5" component="div" style={{ color: "black" }}>
                                            {chat.lastMessage}
                                        </Typography>
                                        <Typography variant="body1" component="div" style={{ color: "black" }}>
                                            <b>chat with {chat.user1._id !== props.auth.user.id ? chat.user1.name : chat.user2.name} for ad ' {chat.ad.name} '</b>
                                        </Typography>
                                    </CardContent>
                                </RouterLink>
                            </Card>
                            <br />
                        </Box>
                    ))}
                </React.Fragment>}
            </Container>
        </div>
    );
}

export default connect(mapStateToProps, null)(ContactList);
