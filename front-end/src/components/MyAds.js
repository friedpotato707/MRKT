import React from "react";
import AdList from "./AdList";
import { connect } from "react-redux";

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

const MyAdList = props => {
    return (
        <div>
            <AdList title={"Your ads"} userId={props.auth.user.id}/>
        </div>
    );
}

export default connect(mapStateToProps, null)(MyAdList);
