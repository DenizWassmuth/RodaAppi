import type {CapoEventEnumType, CapoEventFilterDto} from "../types/CapoEvent.ts";
import "../styles/FilterBar.css"
import * as React from "react";
import type {CityData, CountryData, StateData} from "../types/GeoData.ts";
import {useEffect, useMemo, useState} from "react";
import {dateToStartOfDayLocalDateTime, nowAsDate} from "../utility/Helpers.ts";
import {fetchCities, fetchStates} from "../utility/AxiosUtilities.ts";

type FilterBarProps = {
    filters: CapoEventFilterDto;
    setFilters: React.Dispatch<React.SetStateAction<CapoEventFilterDto>>;
    countries: CountryData[];
};

export default function FilterBar({ filters, setFilters, countries }: Readonly<FilterBarProps>) {
    const minStart = useMemo(() => nowAsDate(), []);

    const [selectedCountryIso, setSelectedCountryIso] = useState<string | null>(null);

    const [states, setStates] = useState<StateData[]>([]);
    const [selectedStateIso, setSelectedStateIso] = useState<string | null>(null);

    const [cities, setCities] = useState<CityData[]>([]);

    function update<K extends keyof CapoEventFilterDto>(key: K, value: CapoEventFilterDto[K]) {
        setFilters((prev) => {
            const next: CapoEventFilterDto = { ...prev, [key]: value };

            // Upcoming window: if upcomingDays is set, user shouldn't also set date bounds manually (simple rule)
            if (key === "upcomingDays" && value) {
                next.startsAfter = undefined;
                next.startsBefore = undefined;
            }

            // If user manually changes date bounds, clear upcomingDays (so there is only one "date mode")
            if ((key === "startsAfter" || key === "startsBefore") && value) {
                next.upcomingDays = undefined;
            }

            // Country changed: reset dependent filters + local state
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

            // State changed: reset city + local state
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

        setFilters({
            country: undefined,
            state: undefined,
            city: undefined,
            eventType: undefined,
            startsAfter: undefined,
            startsBefore: undefined,
            upcomingDays: undefined,
            recentOnly: false,
            limit: 20,
        });
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
        <div className="filterbar">
            <div className="filterbar__row">
                <label className="filterbar__label">
                    <span>Country</span>
                    <select
                        className="filterbar__input"
                        value={filters.country ?? ""}
                        onChange={(e) => update("country", e.target.value || undefined)}
                    >
                        <option value="" disabled>
                            select a country
                        </option>

                        {countries.map((c) => (
                            <option key={c.isoCode} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="filterbar__label">
                    <span>State</span>
                    <select
                        className="filterbar__input"
                        value={filters.state ?? ""}
                        disabled={!selectedCountryIso}
                        onChange={(e) => update("state", e.target.value || undefined)}
                    >
                        <option value="" disabled>
                            select a state
                        </option>

                        {states.map((s) => (
                            <option key={s.isoCode} value={s.name}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="filterbar__label">
                    <span>City</span>
                    <select
                        className="filterbar__input"
                        value={filters.city ?? ""}
                        disabled={!selectedStateIso}
                        onChange={(e) => update("city", e.target.value || undefined)}
                    >
                        <option value="" disabled>
                            select a city
                        </option>

                        {cities.map((c) => (
                            <option key={c.name} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="filterbar__label">
                    <span>Type</span>
                    <select
                        className="filterbar__input"
                        value={filters.eventType ?? ""}
                        onChange={(e) =>
                            update("eventType", (e.target.value || undefined) as CapoEventEnumType | undefined)
                        }
                    >
                        <option value="">Any</option>
                        <option value="RODA">RODA</option>
                        <option value="WORKSHOP">WORKSHOP</option>
                    </select>
                </label>
            </div>

            <div className="filterbar__row">
                <label className="filterbar__label">
                    <span>Starts after</span>
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
                    <span>Starts before</span>
                    <input
                        className="filterbar__input"
                        type="date"
                        min={minStart}
                        value={filters.startsBefore ? filters.startsBefore.slice(0, 10) : ""}
                        disabled={Boolean(filters.upcomingDays)}
                        onChange={(e) =>
                            update("startsBefore", e.target.value ? dateToStartOfDayLocalDateTime(e.target.value) : undefined)
                        }
                    />
                </label>

                <label className="filterbar__label">
                    <span>Upcoming</span>
                    <select
                        className="filterbar__input"
                        value={filters.upcomingDays ?? ""}
                        onChange={(e) => update("upcomingDays", e.target.value ? Number(e.target.value) : undefined)}
                    >
                        <option value="">Any</option>
                        <option value="7">Next 7 days</option>
                    </select>
                </label>

                <label className="filterbar__checkbox">
                    <input
                        type="checkbox"
                        checked={Boolean(filters.recentOnly)}
                        onChange={(e) => update("recentOnly", e.target.checked)}
                    />
                    <span>Recently added</span>
                </label>

                <label className="filterbar__label">
                    <span>Show</span>
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

                <button type="button" className="filterbar__btn" onClick={reset}>
                    Reset
                </button>
            </div>
        </div>
    );
}