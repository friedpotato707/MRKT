import React, { useState, useEffect } from "react";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink } from "react-router-dom";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import arrayBufferToBase64 from "../utils";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingScreen from "./LoadingScreen";
import Card from '@material-ui/core/Card';

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    replyButton: {
        height: "40px",
    },
    itemImg: {
        width: "100%",
    },
    card: {
        padding: "20px",
    },
}));

const AdInfo = props => {
    const classes = useStyles();
    const [ad, setAd] = useState(null);
    const params = useParams();
    const [doneLoading, setDoneLoading] = useState(false);

    useEffect(() => {
        const id = params.id;

        const fetchAd = async () => {
            const request = new Request("http://localhost:5000/api/ads/" + id, {
                method: "GET",
                headers: {
                },
            });
            const response = await fetch(request);
            const data = await response.json();
            setAd(data);
            setDoneLoading(true);
        }

        fetchAd()
            .catch(console.error);
    }, [])

    return (
        <div>
            <Container maxWidth="md">
                {!doneLoading ? <LoadingScreen /> : <React.Fragment>
                    {ad && <React.Fragment>
                        <br /><br />
                        <Card className={classes.card}>
                            <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
                                <b>{ad ? ad.name : "Loading..."}</b>
                            </Typography>
                            {ad.owner._id === props.auth.user.id &&
                                <Typography align="right" variant="h6" color="textPrimary" gutterBottom>
                                    <b>Your ad</b>
                                </Typography>
                            }
                            {ad.owner._id !== props.auth.user.id &&
                                <Typography align="right" variant="h6" color="textPrimary" gutterBottom>
                                    <b>Posted by {ad.owner.name}</b>
                                </Typography>
                            }
                            <img alt="" className={classes.itemImg} src={`data:image/png;base64,${arrayBufferToBase64(ad.img.data.data)}`} />
                            <br /><br />
                            <Typography variant="h4" color="textPrimary" gutterBottom>
                                <b>Description:</b>
                            </Typography>
                            <Typography variant="h6" color="textPrimary" gutterBottom>
                                {ad.description}
                            </Typography>
                            <br />
                            {props.auth.user.id && ad.owner._id !== props.auth.user.id &&
                                <Box textAlign="center">
                                    <RouterLink to={'/ad/' + params.id + '/user/' + ad.owner._id + '/chat'}>
                                        <Button className={classes.replyButton} variant="contained" style={{ backgroundColor: "orange" }}>
                                            <b>Reply to this ad</b>
                                        </Button>
                                    </RouterLink>
                                </Box>
                            }
                        </Card>
                    </React.Fragment>
                    }
                </React.Fragment>}
                <br /><br /><br />
            </Container>
        </div>
    );
}

export default connect(mapStateToProps, null)(AdInfo);
