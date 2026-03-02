import type {AppUserType} from "../types/AppUser.ts";
import type {CapoEventFilterDto} from "../types/CapoEvent.ts";
import Navbar from "./NavBar.tsx";
import FilterBar from "./FilterBar.tsx";
import type {CountryData} from "../types/GeoData.ts";
import '../styles/NavBar.css'

type TopBarProps = {
    user: AppUserType;
    filters: CapoEventFilterDto;
    setFilters: React.Dispatch<React.SetStateAction<CapoEventFilterDto>>;

    countries: CountryData[];
};

export default function TopBar({user, filters, setFilters, countries}: Readonly<TopBarProps>) {
    return (
        <header className="topbar">
            <div className="topbar__inner">
                <div className="topbar__nav">
                    <Navbar user={user} />
                </div>

                <div className="topbar__filters">
                    <FilterBar filters={filters} setFilters={setFilters} countries={countries} />
                </div>
            </div>
        </header>
    );
}