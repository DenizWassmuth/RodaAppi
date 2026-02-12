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
import CapoEventCard from "./components/CapoEventCard.tsx";




function App() {

    const [user, setUser] = useState<AppUserType>(undefined);
    const [capoEvents, setCapoEvents] = useState<CapoEventType[]>([]);

    const loadUser = () => {
        axios.get("/api/auth")
            .then((response) => setUser(response.data))
            .catch((error) => setUser(null));
    }

    function fetchEvents(){
        axios.get("/api/capoevent")
        .then((response) => setCapoEvents(response.data))
    }

    useEffect(() => {
        loadUser();
        fetchEvents();
    }, []);

  return (
      <>
          <header><Navbar appUser={user} setAppUser={setUser}/></header>
          <div>
              <main>
                  {capoEvents.map(capoEvent => (<CapoEventCard capoEvent={capoEvent} />))}
              </main>
          </div>

          <Routes>
              <Route path={"/"} element={<LandingPage/>}/>
              <Route path={"/rodas"} element={<RodasPage/>}/>
              <Route path={"/workshops"} element={<WorkshopsPage/>}/>

              <Route element={<ProtectedRoute user={user?.username}/> }>
                  <Route path={"/loggedin"} element={<LoggedInPage userName={user?.username}/>}/>
              </Route>
          </Routes>
      </>
  )
}

export default App
