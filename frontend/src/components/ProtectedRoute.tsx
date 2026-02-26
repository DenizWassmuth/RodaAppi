import {Navigate, Outlet} from "react-router-dom";
import type {AppUserType} from "../types/AppUser.ts";

type ProtectedRouteProps = {
    user: AppUserType;
}

export default function ProtectedRoute(props: Readonly<ProtectedRouteProps>) {

    if(props.user === undefined) {
        <h3>loading</h3>
    }

    return (
        props.user ? <Outlet/> : <Navigate to={"/"} />
    )
}