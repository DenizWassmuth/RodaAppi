import '../index.css'
import {useNavigate} from "react-router-dom";
import Logging from "./Logging.tsx";
import type {FormEvent} from "react";
import type {UserProps} from "../types/AppUser.ts";
import '../styles/NavBar.css'

function handleOnClick(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
}

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

    return (
        <div className="navbar-div">
            <form onSubmit={handleOnClick}>
                <button className="navbar-btn" onClick={() => goTo("/")}>Home</button>
                <button className="navbar-btn" onClick={() => goTo("/rodas")}>Rodas</button>
                <button className="navbar-btn" onClick={() => goTo("/workshops")}>Workshops</button>
                <button className="navbar-btn" onClick={() => goTo("/loggedin")}>logged in</button>

                <Logging appUser={props.appUser} setAppUser={props.setAppUser}/>

                {
                    props.appUser === null && <button className="navbar-btn" onClick={login}>Login</button>
                }
                {
                    props.appUser !== null && props.appUser !== undefined && <button className="navbar-btn" onClick={logout}>Logout</button>
                }
            </form>
        </div>
    )
}