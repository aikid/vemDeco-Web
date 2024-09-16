import React from "react";
import {
    Route as ReactDOMRoute,
    RouterProps as ReactDOMRouteProps,
    Redirect
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RouteProps extends ReactDOMRouteProps {
    isPrivate?: boolean;
    component: React.ComponentType;
};

const Route: React.FC<RouteProps> = ({ isPrivate = false, component: Component, ...rest }) =>{
    const { user } = useAuth();

    return (
        <ReactDOMRoute 
        {...rest} 
        render={() => {
            return isPrivate && user.authkey === "logged" ? (
                <Component />
            ) : (

            )
        }}/>
    );
};

export default Route;