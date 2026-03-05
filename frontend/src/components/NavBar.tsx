
import type {AppUserType} from "../types/AppUser.ts";
import '../styles/NavBar.css'

import { useNavigate } from "react-router-dom";


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
        </nav>
    );
}