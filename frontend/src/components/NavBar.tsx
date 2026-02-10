import '../index.css'
import {useNavigate} from "react-router-dom";
import Logging from "./Logging.tsx";
import type {FormEvent} from "react";
import type {UserProps} from "../types/UserType.ts";

export default function Navbar(props:Readonly<UserProps>) {

    const nav = useNavigate();
    function goTo(path: string) {
        nav(path);
    }

    function handleOnClick(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <>
            <form onSubmit={handleOnClick}>
                <button onClick={() => goTo("/")}>Home</button>
                {" "}
                <button onClick={() => goTo("/rodas")}>Rodas</button>
                {" "}
                <button onClick={() => goTo("/workshops")}>Workshops</button>
                {" "}
                <button onClick={() => goTo("/loggedin")}>logged in</button>

            <Logging user={props.user} setUser={props.setUser} />
            </form>
        </>
    )
}