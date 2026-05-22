import Navbar from "./NavBar.tsx";
import FilterBar from "./FilterBar.tsx";
import type {CountryData} from "../types/GeoData.ts";
import '../styles/TopBar.css'
import { useState } from "react";
import {useAuth} from "../context/AuthContext.ts";
import "../index.css"

type TopBarProps = {
    countries: CountryData[];
};

export default function TopBar({ countries }: Readonly<TopBarProps>) {
    const { login, logout, user } = useAuth();
    const [filtersOpen, setFiltersOpen] = useState(false);

    const isLoggedIn = !!user;

    return (
        <header className={`fixed w-full top-0 left-0 z-5 border-b-2 border-gray-500 border-solid backdrop-blur-3xl bg-linear-to-t from-amber-200 to-amber-100 dark:bg-linear-to-t dark:from-zinc-900 dark:to-zinc-800  transition-colors duration-500`}>
            <div className="flex flex-col items-center justify-center px-4 py-2">
                <div className="flex flex-row items-center justify-between w-full px-10">

                    {/* LEFT */}
                    <div role="banner" className="font-bold text-zinc-200">
                        RodaAppi
                    </div>
                    <div className="flex flex-row items-center justify-center w-full gap-x-5">
                        <Navbar />
                        <button
                            type="button"
                            className="text-zinc-200 border-2 border-solid border-yellow-500 px-3 py-1.5 rounded-[10px]"
                            aria-expanded={filtersOpen}
                            aria-controls="topbar-filters"
                            onClick={() => setFiltersOpen((v) => !v)}
                        >
                            {filtersOpen ? "Hide filters" : "Show filters"}
                        </button>
                    </div>

                    {/* RIGHT */}
                    <div>
                        {!isLoggedIn ? (
                            <button type="button" className="topbar__auth" onClick={login}>
                                Login
                            </button>
                        ) : (
                            <button type="button" className="topbar__auth" onClick={logout}>
                                Logout
                            </button>
                        )}
                    </div>
                </div>
                <div id="topbar-filters" className={`mt-10 topbar__filters ${filtersOpen ? "is-open" : ""}`}>
                    <FilterBar
                        countries={countries}
                    />
                </div>
            </div>
        </header>
    );
}