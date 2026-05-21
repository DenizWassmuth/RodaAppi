import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../context/AuthContext.ts";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <h3>Loading...</h3>;
    }

    return (
        user ? <Outlet/> : <Navigate to={"/"} />
    )
}