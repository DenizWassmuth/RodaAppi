import './index.css'

import Navbar from "./components/NavBar.tsx";
import {Route, Routes} from "react-router-dom";
import {useEffect, useState} from "react";
import LoggedInPage from "./components/pages/LoggedInPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import axios from "axios";
import type {AppUserType} from "./types/AppUser.ts";
import type {CapoEventType} from "./types/CapoEvent.ts";
import CapoEventPage from "./components/pages/CapoEventPage.tsx";
import PreviewPage from "./components/pages/PreviewPage.tsx";
import CreateCapoEventPage from "./components/pages/CreateCapoEventPage.tsx";
import EditCapoEventPage from "./components/pages/EditcapoEventPage.tsx";


function App() {

    const [user, setUser] = useState<AppUserType>(null);
    const [capoEvents, setCapoEvents] = useState<CapoEventType[]>([]);
    const [currentPath, setCurrentPath] = useState<string>("/");

    const loadUser = () => {
        axios.get("/api/auth")
            .then((response) => setUser(response.data))
            .catch((error) => setUser(null));
    }

    async function fetchEvents() {
        return await axios.get<CapoEventType[]>("/api/capoevent")
            .then((response) => setCapoEvents(response.data));
    }

    useEffect(() => {
        loadUser();
        fetchEvents()
            .catch((error) => error + ": could not fetch capoEvents");
    }, []);

  return (
      <>
          <header><Navbar user={user}/></header>
          <Routes>
              <Route path={"/"} element={<PreviewPage user={user} events={capoEvents} fetchEvents={fetchEvents} typeOfEvent={"NONE"} pathToSet={"/"} setCurrentPath={setCurrentPath}/>}/>
              <Route path={"/rodas"} element={<PreviewPage user={user} events={capoEvents} fetchEvents={fetchEvents} typeOfEvent={"RODA"} pathToSet={"rodas"} setCurrentPath={setCurrentPath}/>}/>
              <Route path={"/workshops"} element={<PreviewPage user={user} events={capoEvents} fetchEvents={fetchEvents} typeOfEvent={"WORKSHOP"} pathToSet={"workshops"} setCurrentPath={setCurrentPath}/>}/>
              <Route path={"/capoevent/:id"} element={<CapoEventPage appUser={user} fetchEvents={fetchEvents}/>}/>

              <Route element={<ProtectedRoute user={user}/> }>
                  <Route path={"/loggedin"} element={<LoggedInPage user={user} events={capoEvents} fetchEvents={fetchEvents} typeOfEvent={"NONE"} pathToSet={"/loggedin"} setCurrentPath={setCurrentPath}/>}/>
                  <Route path={"/add"} element={<CreateCapoEventPage user={user} fetchEvents={fetchEvents} onClosePath={currentPath}/>}/>
                  <Route path={"/edit/:id"} element={<EditCapoEventPage user={user} fetchEvents={fetchEvents} onClosePath={currentPath} />}/>
              </Route>
          </Routes>
      </>
  )
}

export default App
