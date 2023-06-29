
import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import ReactLoading from "react-loading";

const useStyles = makeStyles((theme) => ({
    loadingBarWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

export default function LoadingScreen(props) {
    const classes = useStyles();

    return (
        <div className={classes.loadingBarWrapper}><ReactLoading type={"bars"} color={"black"} /></div>

    );
}
