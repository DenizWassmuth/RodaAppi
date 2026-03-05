import './index.css'

import {Route, Routes, useLocation} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import axios from "axios";
import type {AppUserType} from "./types/AppUser.ts";
import type {CapoEventFilterDto, CapoEventType} from "./types/CapoEvent.ts";
import PreviewPage from "./components/pages/PreviewPage.tsx";
import CreateCapoEventPage from "./components/pages/CreateCapoEventPage.tsx";
import type {CountryData} from "./types/GeoData.ts";
import {fetchFilteredCapoEvents} from "./utility/AxiosUtilities.ts";
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
    limit: 20,
    isDashboardContent: false,
    creatorId: undefined,
    bookmarkedOnly: false
};

function App() {

    const [user, setUser] = useState<AppUserType>(null);

    const [filters, setFilters] = useState<CapoEventFilterDto>(defaultFilters);
    const [capoEvents, setCapoEvents] = useState<CapoEventType[]>([]);
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [countries, setCountries] = useState<CountryData[]>([]);

    const loadUser = () => {
        axios.get("/api/auth")
            .then((response) => setUser(response.data))
            .catch((error) => {
                setUser(null);
                console.log(error + " user was set to null, as user is not logged in")});
    }

    useEffect(() => {
        loadUser();
        //fetchCountries(setCountries).then();
    }, []);

    const bookmarkedSet = useMemo(() =>
        new Set(bookmarks), [bookmarks]);

    const location = useLocation();
    const bIsDashboard = location.pathname.startsWith("/loggedin");

    const effectiveFilters = useMemo<CapoEventFilterDto>(() => {
        if (bIsDashboard && user) {
            console.log("filtering user created events")
            return { ...filters, isDashboardContent: true , creatorId: user?.id}; // add this field in DTO type
        }

        if (filters.bookmarkedOnly && user) {
            console.log("filtering only bookmarked events")
            return { ...filters, isDashboardContent: false, creatorId: user?.id };
        }

        console.log("filtering all events")
        return { ...filters, isDashboardContent: false, creatorId: null , bookmarkedOnly: false };

    }, [user, filters, bIsDashboard, bookmarkedSet]);

    async function fetchEvents() {
        fetchFilteredCapoEvents(effectiveFilters, setCapoEvents)
            .then()
    }

    useEffect(() => {
        fetchEvents()
            .then();
    }, [effectiveFilters]);

    const fetchBookMarks = () => {

        if (!user || !user?.id) {
            console.log(bookmarks);
            return;
        }

        if (!capoEvents || capoEvents.length <= 0) {
            console.log("didi not get bookmarks, as no events were fetched");
            return;
        }

        axios.get<string[]>(`/api/bookmarks/${user?.id}`)
            .then((response) => {
                setBookmarks(response.data);
                console.log("fetched bookmarks: ");
                console.log(response.data);
            })
            .catch((error) => {
                setBookmarks([]);
                console.log(error + ": could not fetch bookmarks")
            });
    }

    useEffect(() => {
        fetchBookMarks();

    }, [user]);

    return (
        <>
            <TopBar user={user} filters={filters} setFilters={setFilters} countries={countries}/>
            <div className="app_content">
                <Routes>

                    <Route path={"/"} element={
                        <PreviewPage
                            user={user}
                            events={capoEvents}
                            fetchEvents={fetchEvents}
                            bookmarkedSet={bookmarkedSet}
                            fetchBookmarks={fetchBookMarks}
                            bOnDashboard={bIsDashboard}
                        />}
                    />

                    <Route element={<ProtectedRoute user={user}/>}>

                        <Route path={"/loggedin"} element={
                            <PreviewPage
                                user={user}
                                events={capoEvents}
                                fetchEvents={fetchEvents}
                                bookmarkedSet={bookmarkedSet}
                                fetchBookmarks={fetchBookMarks}
                                bOnDashboard={bIsDashboard}
                            />}
                        />

                        <Route path={"/add"} element={
                            <CreateCapoEventPage
                                user={user}
                                fetchEvents={fetchEvents}
                                onClosePath={"/loggedin"}
                                countries={countries}
                                setCountries={setCountries}
                            />}
                        />

                    </Route>
                </Routes>
            </div>
        </>
    )
}

export default App
