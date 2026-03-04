import type {AppUserType} from "../types/AppUser.ts";
import type {CapoEventFilterDto} from "../types/CapoEvent.ts";
import Navbar from "./NavBar.tsx";
import FilterBar from "./FilterBar.tsx";
import type {CountryData} from "../types/GeoData.ts";
import '../styles/TopBar.css'

type TopBarProps = {
    user: AppUserType;
    filters: CapoEventFilterDto;
    setFilters: React.Dispatch<React.SetStateAction<CapoEventFilterDto>>;

    countries: CountryData[];
};

import { useState } from "react";

export default function TopBar({ user, filters, setFilters, countries }: Readonly<TopBarProps>) {
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

    return (
        <header className={`topbar ${filtersOpen ? "topbar--open" : ""}`}>
            <div className="topbar__inner">
                <div className="topbar__navrow">
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

                {/* Collapsible filters */}
                <div id="topbar-filters" className={`topbar__filters ${filtersOpen ? "is-open" : ""}`}>
                    <FilterBar filters={filters} setFilters={setFilters} countries={countries} />
                </div>
            </div>
        </header>
    );
}