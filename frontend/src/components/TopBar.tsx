import FilterBar from "./FilterBar.tsx";
import type {CountryData} from "../types/GeoData.ts";
import {useAuth} from "../context/AuthContext.ts";
import "../index.css"
import { motion, AnimatePresence } from "framer-motion";
import {useNavigate} from "react-router-dom";
import StdButton from "./buttons/StdButton.tsx";
import {useFilters} from "../context/FilterContext.ts";

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
        <header className={`fixed w-full top-0 left-0 z-5 border-b-2 border-gray-500 border-solid backdrop-blur-3xl bg-linear-to-t from-amber-200 to-amber-100 dark:bg-linear-to-t dark:from-zinc-900 dark:to-zinc-800  transition-colors duration-500`}>
            <div className="flex flex-col items-center justify-center px-4 py-2">
                <div className="flex flex-row items-center justify-between w-full px-10 mb-2">
                    <div
                        role="banner"
                        className={"font-bold text-zinc-200"}
                    >
                        RodaAppi
                    </div>
                    <div className="flex flex-row items-center justify-center w-full gap-x-5">
                        {/*<Navbar />*/}
                        <StdButton buttonId="tb-home-btn" name="Home" onClick={() => goTo("/")} />
                        <StdButton buttonId="tb-dashboard-btn" name="Dashboard" onClick={() => goTo("/loggedin")} />
                        <StdButton buttonId="tb-filters-btn" name="Filters" onClick={() => setFiltersOpen((v) => !v)} />
                    </div>
                    <div>
                        {!bIsLoggedIn ? (
                            <StdButton buttonId="tb-login-btn" name="Login" onClick={login} />
                        ) : (
                            <StdButton buttonId="tb-logout-btn" name="Logout" onClick={logout} />
                        )}
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
                                initial={{ y: 100}}
                                animate={{ y: 5}}
                                exit={{ y: 100}}
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