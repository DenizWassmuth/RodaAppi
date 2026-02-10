import '../index.css'
import {useEffect, useState} from "react";
import axios from "axios";

export default function Login() {

    const [user, setUser] = useState<string | undefined | null>(undefined);

    function login(){
        // schaue wo sind wir gerade und passe die Zieladresse entsprechend an
        const host:string = window.location.host === "localhost:5173" ?
            "http://localhost:8080" : window.location.origin
        window.open(host + "/oauth2/authorization/github", "_self")
    }

    const loadUser = () => {
        axios.get("/api/auth")
            .then((response) => setUser(response.data))
            .catch((error) => setUser(null));
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