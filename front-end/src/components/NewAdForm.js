import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { post } from 'axios';
import { connect } from "react-redux";
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import defaultImage from '../assets/DefaultImage.png';

const MAX_LENGTH_NAME = 20;
const MAX_LENGTH_DESCRIPTION = 100;

const useStyles = makeStyles((theme) => ({
    box: {
        marginTop: "20px",
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        width: "100%",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '30%',
        width: '100%',
        height: "500px"
    },
    cardContent: {
        flexGrow: 1,
    },
    button: {
        marginTop: "10px",
        marginBottom: "10px",
        width: "150px",
    },
}));

const MultilineTextFields = props => {
    const [name, setName] = React.useState("");
    const [userLocation] = React.useState("");
    const [phoneNumber] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [preview, setPreview] = React.useState()
    const history = useHistory();
    const classes = useStyles();

    React.useEffect(() => {
        if (!selectedImage) {
            setPreview(undefined)
            return
        }

        let reader = new FileReader()
        reader.readAsDataURL(selectedImage)
        reader.onload = () => {
            setPreview(reader.result)

        }
    }, [selectedImage])

    function handleSubmit(e) {
        e.preventDefault()
        if (!preview) {
            window.alert("You need to select image to proceed.");
            return;
        }
        const url = "http://localhost:5000/api/ads";
        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('name', name);
        formData.append('userLocation', userLocation);
        formData.append('phoneNumber', phoneNumber);
        formData.append('description', description);
        formData.append('userId', props.auth.user.id);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        post(url, formData, config).then((response) => {
            history.push("/");
        }).catch((error) => {
            window.alert("Something went wrong. Please try again.");
        });
    }

    return (
        <React.Fragment>
            <Container maxWidth="md">
                <React.Fragment>
                    <Box
                        p={1}
                        className={classes.box}
                        component="form"
                        sx={{
                            "& .MuiTextField-root": { width: "100%", pl: 1, pr: 1, mb: 1, },
                        }}
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <Card className={classes.card}>
                            <Box textAlign="center">
                                <Typography gutterBottom variant="h4" component="h2">
                                    <b>Post new ad</b>
                                </Typography>
                            </Box>
                            <br />
                            <CardMedia
                                className={classes.cardMedia}
                                image={preview ? preview : defaultImage}
                                title="Image title"
                            />
                            <Box textAlign="center">
                                <input
                                    accept="image/*"
                                    type="file"
                                    id="select-image"
                                    style={{ display: 'none' }}
                                    onChange={e => setSelectedImage(e.target.files[0])}
                                />
                                <br />
                                <label htmlFor="select-image">
                                    <Button variant="contained" color="primary" component="span" className={classes.button}>
                                        Upload Image
                                    </Button>
                                </label>
                            </Box>
                            <br />
                            <TextField
                                inputProps={{
                                    maxLength: MAX_LENGTH_NAME,
                                    style: {
                                        paddingLeft: 15,
                                    },
                                }}
                                required
                                variant="outlined"
                                size="small"
                                id="filled-error"
                                placeholder="Enter your ad name here"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                inputProps={{
                                    maxLength: MAX_LENGTH_DESCRIPTION,
                                }}
                                required
                                variant="outlined"
                                multiline
                                placeholder="Describe your ad here"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                            <Box textAlign="center">
                                <Button variant="contained" type="submit" className={classes.button}>
                                    Post ad
                                </Button>
                            </Box>
                            <br />
                        </Card>
                    </Box>
                </React.Fragment>
            </Container>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, null)(MultilineTextFields);
