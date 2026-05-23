import type {CapoEventEnumType, CapoEventFilterDto} from "../types/CapoEvent.ts";
import "../styles/FilterBar.css"
import type {CountryData} from "../types/GeoData.ts";
import {useEffect, useMemo} from "react";
import {
    addOneDayToDateInput,
    dateToStartOfDayLocalDateTime,
    nowAsDate
} from "../utility/Helpers.ts";
import {fetchCities, fetchStates} from "../utility/AxiosUtilities.ts";
import {useAuth} from "../context/AuthContext.ts";
import {useFilters} from "../context/FilterContext.ts";
import StdButton from "./buttons/StdButton.tsx";

type FilterBarProps = {
    countries: CountryData[];
};

export default function FilterBar({countries}: Readonly<FilterBarProps>) {
    const minStart = useMemo(() => nowAsDate(), []);
    const {user} = useAuth();
    const {
        filters,
        setFilters,
        selectedCountryIso,
        setSelectedCountryIso,
        selectedStateIso,
        setSelectedStateIso,
        states,
        setStates,
        cities,
        setCities,
        resetFilters
    } = useFilters();

    const bIsLoggedIn = !!user;

    function update<K extends keyof CapoEventFilterDto>(key: K, value: CapoEventFilterDto[K]) {
        setFilters((prev) => {
            const next: CapoEventFilterDto = {...prev, [key]: value};

            if (key === "upcomingDays" && value) {
                next.startsAfter = undefined;
                next.startsBefore = undefined;
            }

            if ((key === "startsAfter" || key === "startsBefore") && value) {
                next.upcomingDays = undefined;
            }

            if (key === "country") {
                const countryName = String(value ?? "");
                const countryIso = countries?.find((c) => c.name === countryName)?.isoCode ?? "";

                setSelectedCountryIso(countryIso);
                setSelectedStateIso(null);

                setStates([]);
                setCities([]);

                next.state = undefined;
                next.city = undefined;
            }

            if (key === "state") {
                const stateName = String(value ?? "");
                const stateIso = states?.find((s) => s.name === stateName)?.isoCode ?? "";

                setSelectedStateIso(stateIso);
                setCities([]);

                next.city = undefined;
            }

            return next;
        });
    }

    function reset() {
        resetFilters();
    }

    useEffect(() => {
        if (!selectedCountryIso) return;
        fetchStates(setStates, selectedCountryIso).then();
    }, [selectedCountryIso]);

    useEffect(() => {
        if (!selectedCountryIso || !selectedStateIso) return;
        fetchCities(setCities, selectedCountryIso, selectedStateIso).then();
    }, [selectedCountryIso, selectedStateIso]);

    return (
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 bg-transparent text-white">
            <label className="flex flex-col items-center justify-start">
                <select
                    value={filters.limit ?? 20}
                    onChange={(e) => update("limit", Number(e.target.value) as 10 | 20 | 30)}
                    className="p-1 rounded-md border border-zinc-600 bg-gray-950 text-zinc-200"
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                </select>
            </label>
            <div className="grid gap-2.5">
                <div className="mb-2.5 flex flex-wrap items-end gap-3">
                    <label className="flex flex-col min-w-40 gap-1.5">
                        <select
                            className="filterbar-input"
                            value={filters.country ?? ""}
                            onChange={(e) => update("country", e.target.value || undefined)}
                        >
                            <option
                                value=""
                                disabled={true}
                                hidden={filters.country !== undefined && filters.country !== null}
                            >
                                country
                            </option>
                            <option
                                value=""
                                disabled={filters.country === undefined || filters.country === null}
                                hidden={filters.country === undefined || filters.country === null}
                            >
                                clear field
                            </option>
                            {countries.map((c) => (
                                <option
                                    key={c.isoCode}
                                    value={c.name}
                                >
                                    {c.name} </option>
                            ))}
                        </select>
                    </label>

                    <label className="filterbar-label">
                        <select
                            className="filterbar-input"
                            value={filters.state ?? ""}
                            disabled={!selectedCountryIso}
                            onChange={(e) => update("state", e.target.value || undefined)}
                        >
                            <option value="" disabled={true} hidden={filters.state !== undefined && filters.state !== null}>state</option>
                            <option value="" disabled={filters.state === undefined || filters.state === null}
                                    hidden={filters.state === undefined || filters.state === null}>clear field
                            </option>
                            {states.map((s) => (
                                <option key={s.isoCode} value={s.name}> {s.name} </option>
                            ))}
                        </select>
                    </label>

                    <label className="filterbar-label">
                        <select
                            className="filterbar-input"
                            value={filters.city ?? ""}
                            disabled={!selectedStateIso}
                            onChange={(e) => update("city", e.target.value || undefined)}
                        >
                            <option value="" disabled={true} hidden={filters.city !== undefined && filters.city !== null}> select a city</option>
                            <option value="" disabled={filters.city === undefined || filters.city === null}
                                    hidden={filters.city === undefined || filters.city === null}>clear field
                            </option>
                            {cities.map((c) => (
                                <option key={c.name} value={c.name}> {c.name} </option>
                            ))}
                        </select>
                    </label>

                    <label className="filterbar-label">
                        <select
                            value={filters.eventType ?? ""}
                            onChange={(e) =>
                                update("eventType", (e.target.value || undefined) as CapoEventEnumType | undefined)
                            }
                            className="filterbar-input"
                        >
                            <option value="">any type</option>
                            <option value="RODA">RODA</option>
                            <option value="WORKSHOP">WORKSHOP</option>
                        </select>
                    </label>
                </div>

                <div className="mb-2.5 flex flex-wrap items-end gap-3">
                    <label className="filterbar-label">
                        <select
                            value={filters.upcomingDays ?? ""}
                            onChange={(e) => update("upcomingDays", e.target.value ? Number(e.target.value) : undefined)}
                            className="filterbar-input"
                        >
                            <option value="">pick date</option>
                            <option value="7">Next 7 days</option>
                            <option value="30">Next 30 days</option>
                            <option value="90">Next 90 days</option>
                            <option value="180">Next 180 days</option>
                            <option value="365">Next 365 days</option>
                        </select>
                    </label>

                    <label className="filterbar-label">
                        <input
                            type="date"
                            min={minStart}
                            value={filters.startsAfter ? filters.startsAfter.slice(0, 10) : ""}
                            disabled={Boolean(filters.upcomingDays)}
                            onChange={(e) =>
                                update("startsAfter", e.target.value ? dateToStartOfDayLocalDateTime(e.target.value) : undefined)
                            }
                            className="filterbar-input"

                        />
                    </label>

                    <label className="filterbar-label">
                        <input
                            type="date"
                            min={filters.startsAfter ? addOneDayToDateInput(filters.startsAfter) : minStart}
                            value={filters.startsBefore ? filters.startsBefore.slice(0, 10) : ""}
                            disabled={Boolean(filters.upcomingDays)}
                            onChange={(e) =>
                                update("startsBefore", e.target.value ? dateToStartOfDayLocalDateTime(e.target.value) : undefined)
                            }
                            className="filterbar-input"
                        />
                    </label>

                    <label className="flex items-center gap-2 py-1.5">
                        <input
                            type="checkbox"
                            checked={Boolean(filters.recentOnly)}
                            onChange={(e) => update("recentOnly", e.target.checked)}
                        />
                        <span>recently added</span>
                    </label>

                    {bIsLoggedIn && (
                        <label className="flex items-center gap-2 py-1.5">
                            <input
                                type="checkbox"
                                disabled={Boolean(!bIsLoggedIn)}
                                checked={Boolean(filters.bookmarkedOnly)}
                                onChange={(e) => update("bookmarkedOnly", e.target.checked)}
                            />
                            <span>bookmarked</span>
                        </label>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-end">
                <StdButton buttonId={"filters-reset-btn"} name={"Reset"} onClick={reset} />
            </div>
        </div>
    );
}