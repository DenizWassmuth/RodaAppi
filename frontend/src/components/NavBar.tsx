
import '../styles/NavBar.css'
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext.ts";

export default function Navbar() {
    const nav = useNavigate();
    const { user } = useAuth();

    const isLoggedIn = !!user;

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