import './index.css'

import {Route, Routes} from "react-router-dom";
import {useEffect, useState} from "react";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import axios from "axios";
import type {AppUserType} from "./types/AppUser.ts";
import type {CapoEventFilterDto, CapoEventType} from "./types/CapoEvent.ts";
import PreviewPage from "./components/pages/PreviewPage.tsx";
import CreateCapoEventPage from "./components/pages/CreateCapoEventPage.tsx";
import type {CountryData} from "./types/GeoData.ts";
import {fetchCountries, fetchFilteredCapoEvents} from "./utility/AxiosUtilities.ts";
import TopBar from "./components/TopBar.tsx";

const defaultFilters: CapoEventFilterDto = {
    country: undefined,
    state: undefined,
    city: undefined,
    eventType: undefined,
    startsAfter: undefined,
    startsBefore: undefined,
    upcomingOnly: false,
    upcomingDays: 90,
    recentOnly: false,
    limit: 20
};

function App() {

    const [user, setUser] = useState<AppUserType>(null);

    const [filters, setFilters] = useState<CapoEventFilterDto>(defaultFilters);
    const [capoEvents, setCapoEvents] = useState<CapoEventType[]>([]);
    const [bookmarks, setBookmarks] = useState<string[] | null>(null);

    const [countries, setCountries] = useState<CountryData[]> ([]);


    const loadUser = () => {
        axios.get("/api/auth")
            .then((response) => setUser(response.data))
            .catch((error) => {
                setUser(null);
                console.log(error + " user was set to null, as user is not logged in")});
    }

    async function fetchEvents() {

        fetchFilteredCapoEvents(filters,setCapoEvents)
            .then()
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

    useEffect(() => {
        loadUser();
        fetchEvents()
            .then();
        //fetchCountries(setCountries).then();

    }, []);

    useEffect(() => {
        fetchEvents()
            .then();

    }, [filters]);

    useEffect(() => {
        if (!capoEvents || capoEvents.length <= 0) {
            return;
        }

        getUsersBookMarks().then();

    }, [capoEvents]);

  return (
      <>
          <TopBar user={user} filters={filters} setFilters={setFilters} countries={countries} />

          <div className="app_content">
          <Routes>
              <Route path={"/"} element={<PreviewPage user={user} events={capoEvents} fetchEvents={fetchEvents} bIsLoginArea={false} bookmarks={bookmarks}/>}/>
              <Route element={<ProtectedRoute user={user}/> }>
                  <Route path={"/loggedin"} element={<PreviewPage user={user} events={capoEvents} fetchEvents={fetchEvents} bIsLoginArea={true} bookmarks={bookmarks} />}/>
                  <Route path={"/add"} element={<CreateCapoEventPage user={user} fetchEvents={fetchEvents} onClosePath={"/loggedin"} countries={countries} setCountries={setCountries}/>}/>
              </Route>
          </Routes>
          </div>
      </>
  )
}

export default App
