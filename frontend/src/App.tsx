import './index.css'

import Navbar from "./components/NavBar.tsx";
import {Route, Routes} from "react-router-dom";
import {useEffect, useState} from "react";
import LoggedInPage from "./components/LoggedInPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import axios from "axios";
import type {AppUserType} from "./types/AppUser.ts";
import type {CapoEventType} from "./types/CapoEvent.ts";
import CapoEventPage from "./components/CapoEventPage.tsx";
import PreviewPage from "./components/PreviewPage.tsx";
import CreateCapoEventPage from "./components/CreateCapoEventPage.tsx";
import EditCapoEventPage from "./components/EditcapoEventPage.tsx";


function App() {

    const [user, setUser] = useState<AppUserType>(null);
    const [capoEvents, setCapoEvents] = useState<CapoEventType[]>([]);

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
              <Route path={"/"} element={<PreviewPage user={user} events={capoEvents} fetchEvents={fetchEvents} typeOfEvent={"NONE"}/>}/>
              <Route path={"/rodas"} element={<PreviewPage user={user} events={capoEvents} fetchEvents={fetchEvents} typeOfEvent={"RODA"}/>}/>
              <Route path={"/workshops"} element={<PreviewPage user={user} events={capoEvents} fetchEvents={fetchEvents} typeOfEvent={"WORKSHOP"}/>}/>
              <Route path={"/capoevent/:id"} element={<CapoEventPage appUser={user} fetchEvents={fetchEvents}/>}/>

              <Route element={<ProtectedRoute user={user?.username}/> }>
                  <Route path={"/loggedin"} element={<LoggedInPage user={user} events={capoEvents} fetchEvents={fetchEvents} typeOfEvent={"NONE"}/>}/>
                  <Route path={"/add"} element={<CreateCapoEventPage user={user} fetchEvents={fetchEvents}/>}/>
                  <Route path={"/edit/:id"} element={<EditCapoEventPage user={user} fetchEvents={fetchEvents}/>}/>
              </Route>
          </Routes>
      </>
  )
}

export default App
