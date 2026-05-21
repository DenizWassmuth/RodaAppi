import Navbar from "./NavBar.tsx";
import FilterBar from "./FilterBar.tsx";
import type {CountryData} from "../types/GeoData.ts";
import '../styles/TopBar.css'
import { useState } from "react";
import {useAuth} from "../context/AuthContext.ts";

type TopBarProps = {
    countries: CountryData[];
};

export default function TopBar({ countries }: Readonly<TopBarProps>) {
    const { login, logout, user } = useAuth();
    const [filtersOpen, setFiltersOpen] = useState(false);

    const isLoggedIn = !!user;

    return (
        <header className={`topbar ${filtersOpen ? "topbar--open" : ""}`}>
            <div className="topbar__inner">
                <div className="topbar__navrow">

                    {/* LEFT */}
                    <div className="topbar__brand" role="banner">
                        RodaAppi
                    </div>

                    {/* CENTER (navbar + toggle) */}
                    <div className="topbar__center">
                        <Navbar />

                        <button
                            type="button"
                            className="topbar__toggle"
                            aria-expanded={filtersOpen}
                            aria-controls="topbar-filters"
                            onClick={() => setFiltersOpen((v) => !v)}
                        >
                            {filtersOpen ? "Hide filters" : "Show filters"}
                        </button>
                    </div>

                    {/* RIGHT */}
                    <div className="topbar__actions">
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

                <div id="topbar-filters" className={`topbar__filters ${filtersOpen ? "is-open" : ""}`}>
                    <FilterBar
                        countries={countries}
                    />
                </div>
            </div>
        </header>
    );
}