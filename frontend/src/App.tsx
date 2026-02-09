import './App.css'
import axios from "axios";
import {useEffect} from "react";

function App() {

    function login(){
        // schaue wo sind wir gerade und passe die Zieladresse entsprechend an
        const host:string = window.location.host === "localhost:5173" ?
            "http://localhost:8080" : window.location.origin
        window.open(host + "/oauth2/authorization/github", "_self")
    }

    const loadUser = () => {
        axios.get("/api/auth")
            .then((response) => {console.log(response.data)})
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

export default App
