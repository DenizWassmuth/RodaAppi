import './index.css'

import {Route, Routes} from "react-router-dom";
import {useEffect, useState} from "react";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import PreviewPage from "./components/pages/PreviewPage.tsx";
import CreateCapoEventPage from "./components/pages/CreateCapoEventPage.tsx";
import type {CountryData} from "./types/GeoData.ts";
import {fetchCountries} from "./utility/AxiosUtilities.ts";
import TopBar from "./components/TopBar.tsx";
import {useAuth} from "./context/AuthContext.ts";
import {useEvents} from "./context/EventContext.ts";

function App() {

    const {loading: authLoading} = useAuth();
    const {loading: eventsLoading} = useEvents();

    const [countries, setCountries] = useState<CountryData[]>([]);

    useEffect(() => {
        fetchCountries(setCountries).then();
    }, []);

    if (authLoading || eventsLoading) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <>
            <TopBar countries={countries}/>
            <div className="app_content">
                <Routes>
                    <Route path={"/"} element={
                        <PreviewPage bOnDashboard={false} />
                    }
                    />
                    <Route element={<ProtectedRoute/>}>
                        <Route
                            path={"/loggedin"}
                            element={<PreviewPage bOnDashboard={true} />}
                        />
                        <Route
                            path={"/add"}
                            element={<CreateCapoEventPage
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
