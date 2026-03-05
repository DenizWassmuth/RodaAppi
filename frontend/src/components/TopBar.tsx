import type {AppUserType} from "../types/AppUser.ts";
import type {CapoEventFilterDto} from "../types/CapoEvent.ts";
import Navbar from "./NavBar.tsx";
import FilterBar from "./FilterBar.tsx";
import type {CountryData} from "../types/GeoData.ts";
import '../styles/TopBar.css'
import { useState } from "react";
import * as React from "react";
import {login, logout} from "../utility/Auth.ts";

type TopBarProps = {
    user: AppUserType;
    filters: CapoEventFilterDto;
    setFilters: React.Dispatch<React.SetStateAction<CapoEventFilterDto>>;

    countries: CountryData[];
};

export default function TopBar({ user, filters, setFilters, countries }: Readonly<TopBarProps>) {
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
                        <Navbar user={user} />

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
                        filters={filters}
                        setFilters={setFilters}
                        countries={countries}
                        bIsLoggedIn={isLoggedIn}
                    />
                </div>
            </div>
        </header>
    );
}