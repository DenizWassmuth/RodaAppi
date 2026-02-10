import '../index.css'
import {useNavigate} from "react-router-dom";
import Login from "./Login.tsx";
import type {FormEvent} from "react";

export default function Navbar() {

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
            <Login/>
            </form>
        </>
    )
}