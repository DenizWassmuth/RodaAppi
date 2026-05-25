import { createContext, useContext } from 'react';
import type { CapoEventFilterDto } from '../types/CapoEvent.ts';
import type { CityData, CountryData, StateData } from "../types/GeoData.ts";

export interface FilterContextType {
    filters: CapoEventFilterDto;
    setFilters: React.Dispatch<React.SetStateAction<CapoEventFilterDto>>;
    filtersOpen: boolean;
    setFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCountryIso: string | null;
    setSelectedCountryIso: React.Dispatch<React.SetStateAction<string | null>>;
    selectedStateIso: string | null;
    setSelectedStateIso: React.Dispatch<React.SetStateAction<string | null>>;
    states: StateData[];
    setStates: React.Dispatch<React.SetStateAction<StateData[]>>;
    cities: CityData[];
    setCities: React.Dispatch<React.SetStateAction<CityData[]>>;
    resetFilters: () => void;
    updateFilter: <K extends keyof CapoEventFilterDto>(key: K, value: CapoEventFilterDto[K], countries?: CountryData[]) => void;
}

export const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useFilters must be used within a FilterProvider');
    }
    return context;
};
