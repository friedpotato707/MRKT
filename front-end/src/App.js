import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import "./App.css";
import NewAdForm from "./components/NewAdForm";
import MyAdList from "./components/MyAds";
import AdInfo from "./components/AdInfo";
import Chat from "./components/Chat";
import ContactList from "./components/ContactList";

if (localStorage.jwtToken) {
    const token = localStorage.jwtToken;
    setAuthToken(token);
    const decoded = jwt_decode(token);
    store.dispatch(setCurrentUser(decoded));
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = "./login";
    }
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Navbar />
                        <Route exact path="/" component={Landing} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/ads/post" component={NewAdForm} />
                        <Route exact path="/ads/my-ads" component={MyAdList} />
                        <Route exact path="/ad/:id" component={AdInfo} />
                        <Route exact path="/ad/:adId/user/:userId/chat" component={Chat} />
                        <Route exact path="/messages" component={ContactList} />
                    </div>
                </Router>
            </Provider>
        );
    }
}
export default App;
