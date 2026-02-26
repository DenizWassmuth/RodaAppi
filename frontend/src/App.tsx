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
    const [bookmarks, setBookmarks] = useState<string[] | null>(null);

    const loadUser = () => {
        axios.get("/api/auth")
            .then((response) => setUser(response.data))
            .catch((error) => {setUser(null); console.log(error + " user was set to null, as user is not logged in")});
    }

    async function getUsersBookMarks() {
        if (!user) {
            console.log("could not get bookmarks, user not logged in");
            return;
        }

        await axios.get<string[]>(`/api/bookmarks/${user.id}`)
            .then((response) => {
                setBookmarks(response.data);
                console.log("fetched bookmarks: ");
                console.log(response.data);
            })
            .catch((error) => error + ": could not fetch bookmarks");
    }

    async function fetchEvents() {

        await axios.get<CapoEventType[]>("/api/capoevent")
            .then((response) => {
                setCapoEvents(response.data);
                console.log("fetched events: ");
                console.log(response.data);
            })
            .catch((error) => error + ": could not fetch capoEvents");
    }

    useEffect(() => {
        loadUser();
        fetchEvents()
            .then();

    }, []);

    useEffect(() => {
        if (capoEvents.length <= 0) {
            return;
        }
        getUsersBookMarks().then();

    }, [capoEvents]);


  return (
      <>
          <header><Navbar user={user}/></header>
          <Routes>
              <Route path={"/"} element={<PreviewPage user={user} events={capoEvents} fetchEvents={fetchEvents} bIsLoginArea={false} bookmarks={bookmarks}/>}/>
              <Route path={"/capoevent/:id"} element={<CapoEventPage user={user} fetchEvents={fetchEvents} />}/>

              <Route element={<ProtectedRoute user={user}/> }>
                  <Route path={"/loggedin"} element={<PreviewPage user={user} events={capoEvents} fetchEvents={fetchEvents} bIsLoginArea={true} bookmarks={bookmarks} />}/>
                  <Route path={"/add"} element={<CreateCapoEventPage user={user} fetchEvents={fetchEvents} onClosePath={"/Loggedin"}/>}/>
              </Route>
          </Routes>
      </>
  )
}

export default App
