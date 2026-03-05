import type {CapoEventEnumType, CapoEventFilterDto} from "../types/CapoEvent.ts";
import "../styles/FilterBar.css"
import * as React from "react";
import type {CityData, CountryData, StateData} from "../types/GeoData.ts";
import {useEffect, useMemo, useState} from "react";
import {
    addOneDayToDateInput,
    dateToStartOfDayLocalDateTime,
    nowAsDate
} from "../utility/Helpers.ts";
import {fetchCities, fetchStates} from "../utility/AxiosUtilities.ts";

const defaultFilters: CapoEventFilterDto = {
    country: undefined,
    state: undefined,
    city: undefined,
    eventType: undefined,
    startsAfter: undefined,
    startsBefore: undefined,
    upcomingOnly: false,
    upcomingDays: 90,
    recentOnly: false,
    limit: 20,
    isDashboardContent: false,
    creatorId: undefined,
    bookmarkedOnly: false
};

type FilterBarProps = {
    filters: CapoEventFilterDto;
    setFilters: React.Dispatch<React.SetStateAction<CapoEventFilterDto>>;
    countries: CountryData[];
    bIsLoggedIn: boolean;
};

export default function FilterBar({ filters, setFilters, countries, bIsLoggedIn }: Readonly<FilterBarProps>) {
    const minStart = useMemo(() => nowAsDate(), []);

    const [selectedCountryIso, setSelectedCountryIso] = useState<string | null>(null);

    const [states, setStates] = useState<StateData[]>([]);
    const [selectedStateIso, setSelectedStateIso] = useState<string | null>(null);

    const [cities, setCities] = useState<CityData[]>([]);

    function update<K extends keyof CapoEventFilterDto>(key: K, value: CapoEventFilterDto[K]) {
        setFilters((prev) => {
            const next: CapoEventFilterDto = { ...prev, [key]: value };

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
        setSelectedCountryIso(null);
        setSelectedStateIso(null);
        setStates([]);
        setCities([]);

        setFilters(defaultFilters);
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

        <div className="filterbar filterbar--grid">
            <div className="filterbar__side filterbar__side--left">
                <label className="filterbar__label">
                    <select
                        className="filterbar__input"
                        value={filters.limit ?? 20}
                        onChange={(e) => update("limit", Number(e.target.value) as 10 | 20 | 30)}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </select>
                </label>
            </div>
            <div className="filterbar__center">
                <div className="filterbar__row">
                    <label className="filterbar__label">
                        <select
                            className="filterbar__input"
                            value={filters.country ?? ""}
                            onChange={(e) => update("country", e.target.value || undefined)}
                        >
                            <option value="" disabled={true} hidden={filters.country !== null}> select a country
                            </option>
                            <option value="" disabled={filters.country === null}
                                    hidden={filters.country === null || filters.country === undefined}>clear field
                            </option>
                            {countries.map((c) => (
                                <option key={c.isoCode} value={c.name}> {c.name} </option>
                            ))}
                        </select>
                    </label>

                    <label className="filterbar__label">
                        <select
                            className="filterbar__input"
                            value={filters.state ?? ""}
                            disabled={!selectedCountryIso}
                            onChange={(e) => update("state", e.target.value || undefined)}
                        >
                            <option value="" disabled={true} hidden={filters.state !== null}> select a state</option>
                            <option value="" disabled={filters.state === null}
                                    hidden={filters.state === null || filters.state === undefined}>clear field
                            </option>
                            {states.map((s) => (
                                <option key={s.isoCode} value={s.name}> {s.name} </option>
                            ))}
                        </select>
                    </label>

                    <label className="filterbar__label">
                        <select
                            className="filterbar__input"
                            value={filters.city ?? ""}
                            disabled={!selectedStateIso}
                            onChange={(e) => update("city", e.target.value || undefined)}
                        >
                            <option value="" disabled={true} hidden={filters.city !== null}> select a city</option>
                            <option value="" disabled={filters.city === null}
                                    hidden={filters.city === null || filters.city === undefined}>clear field
                            </option>
                            {cities.map((c) => (
                                <option key={c.name} value={c.name}> {c.name} </option>
                            ))}
                        </select>
                    </label>

                    <label className="filterbar__label">
                        <select
                            className="filterbar__input"
                            value={filters.eventType ?? ""}
                            onChange={(e) =>
                                update("eventType", (e.target.value || undefined) as CapoEventEnumType | undefined)
                            }
                        >
                            <option value="">any type</option>
                            <option value="RODA">RODA</option>
                            <option value="WORKSHOP">WORKSHOP</option>
                        </select>
                    </label>
                </div>

                <div className="filterbar__row">
                    <label className="filterbar__label">
                        <select
                            className="filterbar__input"
                            value={filters.upcomingDays ?? ""}
                            onChange={(e) => update("upcomingDays", e.target.value ? Number(e.target.value) : undefined)}
                        >
                            <option value="">pick date</option>
                            <option value="7">Next 7 days</option>
                            <option value="30">Next 30 days</option>
                            <option value="90">Next 90 days</option>
                            <option value="180">Next 180 days</option>
                            <option value="365">Next 365 days</option>
                        </select>
                    </label>

                    <label className="filterbar__label">
                        <input
                            className="filterbar__input"
                            type="date"
                            min={minStart}
                            value={filters.startsAfter ? filters.startsAfter.slice(0, 10) : ""}
                            disabled={Boolean(filters.upcomingDays)}
                            onChange={(e) =>
                                update("startsAfter", e.target.value ? dateToStartOfDayLocalDateTime(e.target.value) : undefined)
                            }
                        />
                    </label>

                    <label className="filterbar__label">
                        <input
                            className="filterbar__input"
                            type="date"
                            min={filters.startsAfter ? addOneDayToDateInput(filters.startsAfter) : minStart}
                            value={filters.startsBefore ? filters.startsBefore.slice(0, 10) : ""}
                            disabled={Boolean(filters.upcomingDays)}
                            onChange={(e) =>
                                update("startsBefore", e.target.value ? dateToStartOfDayLocalDateTime(e.target.value) : undefined)
                            }
                        />
                    </label>

                    <label className="filterbar__checkbox">
                        <input
                            type="checkbox"
                            checked={Boolean(filters.recentOnly)}
                            onChange={(e) => update("recentOnly", e.target.checked)}
                        />
                        <span>recently added</span>
                    </label>

                    {bIsLoggedIn && (
                        <label className="filterbar__checkbox">
                            <input
                                type="checkbox"
                                disabled={Boolean(!bIsLoggedIn)}
                                checked={Boolean(filters.bookmarkedOnly)}
                                onChange={(e) => update("bookmarkedOnly", e.target.checked)}
                            />
                            <span>bookmarked only</span>
                        </label>
                    )}
                </div>
            </div>
            <div className="filterbar__side filterbar__side--right">
                <button type="button" className="filterbar__btn" onClick={reset}>
                    Reset
                </button>
            </div>
        </div>
    );
}