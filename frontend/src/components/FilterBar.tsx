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

    const minStart = useMemo(() => nowAsDate(), []); // Compute once on mount.

    const [selectedCountryIso, setSelectedCountryIso] = useState<string | null>(null);

    const [states, setStates] = useState<StateData[]>([]);
    const [selectedStateIso, setSelectedStateIso] = useState<string | null>(null);

    const [cities, setCities] = useState<CityData[]>([]);


    function update<K extends keyof CapoEventFilterDto>(key: K, value: CapoEventFilterDto[K]) {
        setFilters((prev) => ({ ...prev, [key]: value }));

        if (key === "upcomingOnly" && value === true) {
            setFilters((prev) => ({ ...prev, ["startsAfter"]: undefined }));
            setFilters((prev) => ({ ...prev, ["startsBefore"]: undefined }));
        }

        if (key === "country") {
            const countryName = String(value);
            console.log("country:", value);

            const countryIso = countries?.find((c) => c.name === countryName)?.isoCode ?? "";
            setSelectedCountryIso(countryIso);
            console.log("country code:", countryIso);

            setSelectedStateIso(null);
            setStates([]);
            setFilters((prev) => ({...prev, ["state"]: undefined }));

            setCities([])
            setFilters((prev) => ({...prev, ["city"]: undefined}));

        }

        if(key === "state") {
            const stateName = String(value);
            console.log("state:", stateName);

            const stateIso = states?.find((c) => c.name === stateName)?.isoCode ?? "";
            setSelectedStateIso(stateIso);
            console.log("state code:", stateIso);

            setCities([])
            setFilters((prev) => ({...prev, ["city"]: ""}));
        }

        if (key === "city") {
            const cityName = String(value);
            console.log("city: ", cityName);
        }
    }

    function reset() {
        setFilters({
            country: undefined,
            state: undefined,
            city: undefined,
            eventType: undefined,
            startsAfter: undefined,
            startsBefore: undefined,
            upcomingOnly: false,
        });
    }

    useEffect(() => {
        if (!selectedCountryIso) {
            return;
        }

        console.log("fetching states");

        fetchStates(setStates, selectedCountryIso)
            .then();

    },[selectedCountryIso]);

    useEffect(() => {
        if (!selectedCountryIso || !selectedStateIso  ) {
            return;
        }

        fetchCities(setCities, selectedCountryIso, selectedStateIso)
            .then();

    },[selectedCountryIso, selectedStateIso]);

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

                        {countries &&
                            countries.map((c) => (
                                <option key={c.isoCode} value={c.name} >
                                    {c.name}
                                </option>))}
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

                        {countries &&
                            states.map((s) => (
                                <option key={s.isoCode} value={s.name} >
                                    {s.name}
                                </option>))}
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

                        {countries &&
                            cities.map((c) => (
                                <option key={c.name} value={c.name} >
                                    {c.name}
                                </option>))}
                    </select>
                </label>
            </div>

            <div className="filterbar__row">
                <label className="filterbar__label">
                    <span>Type</span>
                    <select
                        className="filterbar__input"
                        value={filters.eventType ?? ""}
                        onChange={(e) => update("eventType", (e.target.value || undefined) as CapoEventEnumType | undefined)}
                    >
                        <option value="">Any</option>
                        <option value="RODA">RODA</option>
                        <option value="WORKSHOP">WORKSHOP</option>
                    </select>
                </label>

                <label className="filterbar__label">
                    <span>Starts after</span>
                    <input
                        className="filterbar__input"
                        type="date"
                        min={minStart}
                        value={filters.startsAfter ?? ""}
                        onChange={(e) => update("startsAfter", dateToStartOfDayLocalDateTime(e.target.value) || undefined)}
                    />
                </label>

                <label className="filterbar__label">
                    <span>Starts before</span>
                    <input
                        className="filterbar__input"
                        type="date"
                        min={minStart}
                        value={filters.startsBefore ?? ""}
                        onChange={(e) => update("startsBefore", dateToStartOfDayLocalDateTime(e.target.value)  || undefined)}
                    />
                </label>

                <label className="filterbar__checkbox">
                    <input
                        type="checkbox"
                        checked={Boolean(filters.upcomingOnly)}
                        onChange={(e) => update("upcomingOnly", e.target.checked)}
                    />
                    <span>Upcoming only</span>
                </label>

                <button type="button" className="filterbar__btn" onClick={reset}>
                    Reset
                </button>
            </div>
        </div>
    );
}