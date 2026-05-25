import FilterBar from "./FilterBar.tsx";
import type {CountryData} from "../types/GeoData.ts";
import {useAuth} from "../context/AuthContext.ts";
import "../index.css"
import { motion, AnimatePresence } from "framer-motion";
import {useNavigate} from "react-router-dom";
import {useFilters} from "../context/FilterContext.ts";
import IconButton from "./buttons/IconButton.tsx";
import {
    FilterFillIcon,
    FilterLineIcon,
    UserFillIcon,
    UserLineIcon
} from "../assets/Icons.tsx";

type TopBarProps = {
    countries: CountryData[];
};

export default function TopBar({ countries }: Readonly<TopBarProps>) {
    const { login, logout, user } = useAuth();
    const { filtersOpen, setFiltersOpen } = useFilters();
    const nav = useNavigate();

    const bIsLoggedIn = !!user;

    function goTo(path: string) {
        nav(path);
    }

    return (
        <header className={`w-full top-0 left-0 z-5 border-b-2 border-zinc-500 border-solid backdrop-blur-md bg-zinc-900/80`}>
            <div className="px-5 max-sm:px-2 py-2 max-sm:py-1">
                <div className="flex flex-row items-center justify-between px-10 max-sm:px-2 mb-2 mt-2">
                    <div
                        role="button"
                        title="Home"
                        onClick={() => goTo("/")}
                        className={"w-10 font-bold text-zinc-200 hover:cursor-pointer"}
                    >
                        RodaAppi
                    </div>
                    <div className="flex flex-row items-center justify-between gap-x-5 max-sm:gap-x-1">
                        {/*<Navbar />*/}
                        <IconButton buttonId={"tb-filters-btn"} title={"Filters"} icon={filtersOpen ? FilterFillIcon : FilterLineIcon} onClick={() => setFiltersOpen((v) => !v)}/>
                    </div>
                    <div>
                        <IconButton buttonId="tb-login-btn" title={bIsLoggedIn ? "Logout" : "Login"} icon={bIsLoggedIn ? UserFillIcon : UserLineIcon} onClick={bIsLoggedIn ? logout : login} />
                    </div>
                </div>
                <AnimatePresence>
                    {filtersOpen && (
                        <motion.div
                            id="tb-filters"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="overflow-hidden w-full"
                        >
                            <motion.div
                                id="tb-filters-content"
                                initial={{ y: 10, opacity: 0}}
                                animate={{ y: 5, opacity: 1}}
                                exit={{ y: 10, opacity: 0}}
                                transition={{ duration: 0.5, ease: "easeInOut"}}
                                className="flex justify-center w-full">
                                <FilterBar
                                    countries={countries}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}