import React, { useState, useEffect } from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink } from "react-router-dom";
import CardMedia from '@mui/material/CardMedia';
import LoadingScreen from "./LoadingScreen";

import arrayBufferToBase64 from "../utils";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(5, 0, 5),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%',
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    media: {
        height: "300px",
        paddingTop: '56.25%', // 16:9
    },
}));

export default function AdList(props) {
    const classes = useStyles();

    const [adList, setAdList] = useState([]);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!props.userId) {
            const fetchAds = async () => {
                const request = new Request("http://localhost:5000/api/ads", {
                    method: "GET",
                    headers: {
                    },
                });
                const response = await fetch(request);
                const data = await response.json();
                setAdList(data ? data : []);
                setDone(true);
            }

            fetchAds()
                .catch(console.error);
        } else {
            const fetchData = async () => {
                const request = new Request("http://localhost:5000/api/ads/user/" + props.userId, {
                    method: "GET",
                    headers: {
                    },
                });
                const response = await fetch(request);
                const data = await response.json();
                setAdList(data ? data : []);
                setDone(true);
            }

            fetchData()
                .catch(console.error);
        }
    }, [])

    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                <Container className={classes.cardGrid} maxWidth="md">
                    {!done ? <LoadingScreen /> :
                        <Grid container spacing={4}>
                            {adList.map((card, index) => (
                                <Grid item xs={12} sm={6} md={4} key={"ad_" + index}>
                                    <RouterLink to={'/ad/' + card._id}>
                                        <Card className={classes.card}>
                                            <CardMedia
                                                className={classes.media}
                                                image={`data:image/png;base64,${arrayBufferToBase64(card.img.data.data)}`}
                                            />
                                            <CardContent className={classes.cardContent}>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    <b>{card.name}</b>
                                                </Typography>
                                                <Typography variant="h6">
                                                    {card.description}
                                                </Typography>
                                                <Typography variant="body1">
                                                    <b>Posted by {card.owner.name}</b>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </RouterLink>
                                </Grid>
                            ))}
                        </Grid>
                    }
                </Container>
            </main>
        </React.Fragment>
    );
}
