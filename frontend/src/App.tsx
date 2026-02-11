import './App.css'
import './index.css'

import Navbar from "./components/NavBar.tsx";
import {Route, Routes} from "react-router-dom";
import LandingPage from "./components/LandingPage.tsx";
import RodasPage from "./components/RodasPage.tsx";
import WorkshopsPage from "./components/WorkshopsPage.tsx";
import {useEffect, useState} from "react";
import LoggedInPage from "./components/LoggedInPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import axios from "axios";

function App() {

    const [user, setUser] = useState<string | undefined | null>(undefined);

    function login(){
        // schaue wo sind wir gerade und passe die Zieladresse entsprechend an
        const host:string = window.location.host === "localhost:5173" ?
            "http://localhost:8080" : window.location.origin
        window.open(host + "/oauth2/authorization/github", "_self")
    }

    function logout(){
        const host:string = window.location.host === "localhost:5173" ?
            "http://localhost:8080" : window.location.origin
        window.open(host + "/logout", "_self")
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
          <header><Navbar user={user} setUser={setUser}/></header>
          {user === null && <button onClick={login}>Login</button>}
          {typeof user === "string" && <button onClick={logout}>Logout</button>}
          <Routes>
              <Route path={"/"} element={<LandingPage/>}/>
              <Route path={"/rodas"} element={<RodasPage/>}/>
              <Route path={"/workshops"} element={<WorkshopsPage/>}/>

              <Route element={<ProtectedRoute user={user}/> }>
                  <Route path={"/loggedin"} element={<LoggedInPage userName={user}/>}/>
              </Route>
          </Routes>
      </>
  )
}

export default App
