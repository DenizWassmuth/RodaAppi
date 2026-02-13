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
import type {AppUserType} from "./types/AppUser.ts";
import type {CapoEventType} from "./types/CapoEvent.ts";
import CapoEventPage from "./components/CapoEventPage.tsx";

function App() {

    const [user, setUser] = useState<AppUserType>(null);
    const [capoEvents, setCapoEvents] = useState<CapoEventType[]>([]);

    const loadUser = () => {
        axios.get("/api/auth")
            .then((response) => setUser(response.data))
            .catch((error) => setUser(null));
    }

    async function fetchEvents(){
       await axios.get<CapoEventType[]>("/api/capoevent").
       then((response) => setCapoEvents(response.data));
    }

    useEffect(() => {
        loadUser();
        fetchEvents().then(() => console.log("data fetched"));
    }, []);

  return (
      <>
          <header><Navbar appUser={user} setAppUser={setUser}/></header>
          <Routes>
              <Route path={"/"} element={<LandingPage events={capoEvents}/>}/>
              <Route path={"/rodas"} element={<RodasPage events={capoEvents}/>}/>
              <Route path={"/workshops"} element={<WorkshopsPage events={capoEvents}/>}/>
              <Route path={"/capoevent/:id"} element={<CapoEventPage appUser={user} fetchEvents={fetchEvents}/>}/>

              <Route element={<ProtectedRoute user={user?.username}/> }>
                  <Route path={"/loggedin"} element={<LoggedInPage userName={user?.username}/>}/>
              </Route>
          </Routes>
      </>
  )
}

export default App
