import {Navigate, Outlet} from "react-router-dom";
import type {AppUserType} from "../types/AppUser.ts";

type ProtectedRouteProps = {
    user: AppUserType;
}

export default function ProtectedRoute({user}: Readonly<ProtectedRouteProps>) {

    if(user === undefined) {
        <h3>loading</h3>
    }

    return (
        user ? <Outlet/> : <Navigate to={"/"} />
    )
}