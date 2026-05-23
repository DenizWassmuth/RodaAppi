import React, { useState, useCallback, type ReactNode } from 'react';
import type { CapoEventFilterDto } from '../types/CapoEvent.ts';
import type { CityData, StateData } from "../types/GeoData.ts";
import { FilterContext } from './FilterContext.ts';

const defaultFilters: CapoEventFilterDto = {
    country: undefined,
    state: undefined,
    city: undefined,
    eventType: undefined,
    startsAfter: undefined,
    startsBefore: undefined,
    upcomingOnly: false,
    upcomingDays: 365,
    recentOnly: false,
    limit: 20,
    isDashboardContent: false,
    creatorId: undefined,
    bookmarkedOnly: false
};

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [filters, setFilters] = useState<CapoEventFilterDto>(defaultFilters);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [selectedCountryIso, setSelectedCountryIso] = useState<string | null>(null);
    const [selectedStateIso, setSelectedStateIso] = useState<string | null>(null);
    const [states, setStates] = useState<StateData[]>([]);
    const [cities, setCities] = useState<CityData[]>([]);

    const resetFilters = useCallback(() => {
        setFilters(defaultFilters);
        setSelectedCountryIso(null);
        setSelectedStateIso(null);
        setStates([]);
        setCities([]);
    }, []);

    return (
        <FilterContext.Provider
            value={{
                filters,
                setFilters,
                filtersOpen,
                setFiltersOpen,
                selectedCountryIso,
                setSelectedCountryIso,
                selectedStateIso,
                setSelectedStateIso,
                states,
                setStates,
                cities,
                setCities,
                resetFilters,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};
