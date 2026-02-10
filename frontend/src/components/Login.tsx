import '../index.css'
import {useEffect, useState} from "react";
import axios from "axios";
import type {UserProps} from "../types/UserType.ts";

export default function Login(props:Readonly<UserProps>) {

    function login(){
        // schaue wo sind wir gerade und passe die Zieladresse entsprechend an
        const host:string = window.location.host === "localhost:5173" ?
            "http://localhost:8080" : window.location.origin
        window.open(host + "/oauth2/authorization/github", "_self")
    }

    const loadUser = () => {
        axios.get("/api/auth")
            .then((response) => props.setUser(response.data))
            .catch((error) => props.setUser(null));
    }

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <>
            <button onClick={login}>Login</button>
        </>
    )
}