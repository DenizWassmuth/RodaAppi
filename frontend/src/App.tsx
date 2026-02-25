import './index.css'

import Navbar from "./components/NavBar.tsx";
import {Route, Routes} from "react-router-dom";
import {useEffect, useState} from "react";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import axios from "axios";
import type {AppUserType} from "./types/AppUser.ts";
import type {CapoEventType} from "./types/CapoEvent.ts";
import CapoEventPage from "./components/pages/CapoEventPage.tsx";
import PreviewPage from "./components/pages/PreviewPage.tsx";
import CreateCapoEventPage from "./components/pages/CreateCapoEventPage.tsx";


function App() {

    const [user, setUser] = useState<AppUserType>(null);
    const [capoEvents, setCapoEvents] = useState<CapoEventType[]>([]);

    const loadUser = () => {
        axios.get("/api/auth")
            .then((response) => setUser(response.data))
            .catch((error) => {setUser(null); console.log(error + " could not get user, user not logged in")});
    }

    async function fetchEvents() {
        return await axios.get<CapoEventType[]>("/api/capoevent")
            .then((response) => setCapoEvents(response.data))
            .catch((error) => error + ": could not fetch capoEvents");
    }

    async function getUsersBookMarks() {
        if (!user) {
            return;
        }

        //return await axios.get<CapoEventType[]>("/api/bookmarks")
    }

    useEffect(() => {
        loadUser();
        fetchEvents().then();
    }, []);

    useEffect(() => {



    }, [capoEvents]);

  return (
      <>
          <header><Navbar user={user}/></header>
          <Routes>
              <Route path={"/"} element={<PreviewPage user={user} events={capoEvents} fetchEvents={fetchEvents} bIsLoginArea={false}/>}/>
              <Route path={"/capoevent/:id"} element={<CapoEventPage user={user} fetchEvents={fetchEvents}/>}/>

              <Route element={<ProtectedRoute user={user}/> }>
                  <Route path={"/loggedin"} element={<PreviewPage user={user} events={capoEvents} fetchEvents={fetchEvents} bIsLoginArea={true} />}/>
                  <Route path={"/add"} element={<CreateCapoEventPage user={user} fetchEvents={fetchEvents} onClosePath={"/Loggedin"}/>}/>
              </Route>
          </Routes>
      </>
  )
}

export default App
