
import type {AppUserType} from "../types/AppUser.ts";
import '../styles/NavBar.css'

import { useNavigate } from "react-router-dom";

function login() {
    const host: string =
        globalThis.location.host === "localhost:5173"
            ? "http://localhost:8080"
            : globalThis.location.origin;
    window.open(host + "/oauth2/authorization/github", "_self");
}

function logout() {
    const host: string =
        globalThis.location.host === "localhost:5173"
            ? "http://localhost:8080"
            : globalThis.location.origin;
    window.open(host + "/logout", "_self");
}

type NavBarProps = {
    user: AppUserType;
};

export default function Navbar(props: Readonly<NavBarProps>) {
    const nav = useNavigate();

    const isLoggedIn = props.user !== null && props.user !== undefined;

    function goTo(path: string) {
        nav(path);
    }

    return (
        <nav className="navbar">
            <button className="navbar_btn" type="button" onClick={() => goTo("/")}>
                Home
            </button>

            <button
                className="navbar_btn"
                type="button"

                disabled={!isLoggedIn}
                onClick={() => goTo("/loggedin")}
            >
                Dashboard
            </button>

            <button
                className="navbar_btn"
                type="button"

                disabled={!isLoggedIn}
                onClick={() => goTo("/add")}
            >
                Add
            </button>

            <button
                className="navbar_btn"
                type="button"
                hidden={isLoggedIn}
                disabled={isLoggedIn}
                onClick={login}
            >
                Login
            </button>

            <button
                className="navbar_btn"
                type="button"
                hidden={!isLoggedIn}
                disabled={!isLoggedIn}
                onClick={logout}
            >
                Logout
            </button>
        </nav>
    );
}