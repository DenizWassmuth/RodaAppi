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
import {useFilters} from "../context/FilterContext.ts";
import StdButton from "./buttons/StdButton.tsx";

type FilterBarProps = {
    countries: CountryData[];
};

export default function FilterBar({countries}: Readonly<FilterBarProps>) {
    const minStart = useMemo(() => nowAsDate(), []);
    const {
        filters,
        selectedCountryIso,
        selectedStateIso,
        states,
        setStates,
        cities,
        setCities,
        resetFilters,
        updateFilter
    } = useFilters();

    function update<K extends keyof CapoEventFilterDto>(key: K, value: CapoEventFilterDto[K]) {
        updateFilter(key, value, countries);
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
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] max-sm:flex max-sm:flex-col items-center max-sm:items-start gap-x-2 max-sm:mb-2 text-white">
            <label className="flex flex-col items-center justify-start mb-2">
                <select
                    value={filters.limit ?? 20}
                    onChange={(e) => update("limit", Number(e.target.value) as 10 | 20 | 30)}
                    className="filterbar-input"
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                </select>
            </label>
            <div className="grid gap-2">
                <div className="mb-2.5 flex flex-wrap max-sm:flex-col items-end max-sm:items-start gap-3">
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

                <div className="mb-2.5 flex flex-wrap max-sm:flex-col items-end max-sm:items-start gap-3">
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

                    <label className="flex items-center gap-2 py-1.5 max-sm:py-0">
                        <input
                            type="checkbox"
                            checked={Boolean(filters.recentOnly)}
                            onChange={(e) => update("recentOnly", e.target.checked)}
                        />
                        <span>recently added</span>
                    </label>
                </div>
            </div>
            <div className="flex items-center justify-end">
                <StdButton buttonId={"filters-reset-btn"} name={"Reset"} onClick={reset} />
            </div>
        </div>
    );
}