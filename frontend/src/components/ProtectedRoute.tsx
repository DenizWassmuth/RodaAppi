
import type {UserProps} from "../types/UserType.ts";
import {Navigate, Outlet} from "react-router-dom";

type ProtectedRouteProps = {
    user: string | undefined | null;
}

export default function ProtectedRoute(props: Readonly<ProtectedRouteProps>) {

    if(props.user === undefined) {
        <h3>loading</h3>
    }

    return (
        props.user ? <Outlet/> : <Navigate to={"/"} />
    )
}