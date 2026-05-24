import './index.css'

import {useEffect, useState} from "react";

import type {CountryData} from "./types/GeoData.ts";
import {fetchCountries} from "./utility/AxiosUtilities.ts";
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import PreviewPage from "./components/pages/PreviewPage.tsx";
import TopBar from "./components/TopBar.tsx";
import {useAuth} from "./context/AuthContext.ts";
import ToggleTheme from "./components/ToggleTheme.tsx";

function App() {

    const {loading: authLoading} = useAuth();

    const [countries, setCountries] = useState<CountryData[]>([]);

    // todo: move this to filter. only fetch countries if they are not already loaded
    useEffect(() => {
        if (countries.length > 0) {
            console.log("countries already loaded");
            return;
        }

        fetchCountries(setCountries).then();
    }, []);

    if (authLoading) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <>
            <ToggleTheme>
                <TopBar countries={countries}/>
                <div className={"overflow-y-auto no-scrollbar scroll-p-0"}>
                    <Routes>
                        <Route path={"/"} element={<PreviewPage countries={countries}/>}/>
                        <Route element={<ProtectedRoute/>}>
                            <Route path={"/loggedin"} element={<PreviewPage countries={countries}/>}/>
                        </Route>
                    </Routes>
                </div>
            </ToggleTheme>
        </>
    )
}

export default App
