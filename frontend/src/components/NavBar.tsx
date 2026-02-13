import '../index.css'
import {useNavigate} from "react-router-dom";
import type {UserProps} from "../types/AppUser.ts";
import '../styles/NavBar.css'

function login(){
    // schaue wo sind wir gerade und passe die Zieladresse entsprechend an
    const host:string = globalThis.location.host === "localhost:5173" ?
        "http://localhost:8080" : window.location.origin
    window.open(host + "/oauth2/authorization/github", "_self")
}

function logout(){
    const host:string = globalThis.location.host === "localhost:5173" ?
        "http://localhost:8080" : window.location.origin
    window.open(host + "/logout", "_self")
}

export default function Navbar(props:Readonly<UserProps>) {

    const nav = useNavigate();
    function goTo(path: string) {
        nav(path);
    }

    const isLoggedIn = props.appUser !== null && props.appUser !== undefined;

    return (
        <div className="navbar_div">
                <button className="navbar_btn" type={"button"} onClick={() => goTo("/")}>Home</button>
                <button className="navbar_btn" type={"button"} onClick={() => goTo("/rodas")}>Rodas</button>
                <button className="navbar_btn" type={"button"} onClick={() => goTo("/workshops")}>Workshops</button>

                {!isLoggedIn && (
                    <>
                        <button className="navbar_btn" type={"button"}  onClick={login}>Login</button>
                    </>)
                }

                {isLoggedIn && (
                    <>
                        <button className="navbar_btn" type={"button"} onClick={() => goTo("/loggedin")}>Dashboard</button>
                        <button className="navbar_btn" type={"button"} onClick={logout}>Logout</button>
                    </>)
                }
        </div>
    )
}