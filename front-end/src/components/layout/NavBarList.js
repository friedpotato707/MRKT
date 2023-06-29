import { Link } from "react-router-dom";
import * as PropTypes from "prop-types";
import React from "react";

export function NavBarList(props) {
    return (
        <>
            <li>
                <Link to="/">Browse ads</Link>
            </li>
            {props.user.name && 
                <React.Fragment>
                    <li>
                        <Link to="/ads/my-ads">My ads</Link>
                    </li>
                    <li>
                        <Link to="/ads/post">Post ad</Link>
                    </li>
                    <li>
                        <Link to="/messages">Messages</Link>
                    </li>
                </React.Fragment>
            }
            {props.user.name && <li>
                <Link to="/">{props.user.name}</Link>
            </li>}
            {props.user.name &&
                <li>
                    <Link to="/" onClick={props.onClick}>Logout</Link>
                </li>
            }
            {!props.user.name &&
                <React.Fragment>
                    <li>
                        <Link to="/login">Log in</Link>
                    </li>
                </React.Fragment>}
        </>
    );
}

NavBarList.propTypes = {
    user: PropTypes.any,
    onClick: PropTypes.func
};
