import { createContext, useContext } from 'react';
import type { CapoEventFilterDto, CapoEventType } from '../types/CapoEvent.ts';

/**
 * Shape of the Event Context.
 * Manages event data, bookmarks, and filtering logic.
 */
export interface EventContextType {
    events: CapoEventType[];
    filters: CapoEventFilterDto;
    bookmarks: string[];
    bookmarkedSet: Set<string>;
    loading: boolean;
    setFilters: React.Dispatch<React.SetStateAction<CapoEventFilterDto>>;
    refreshEvents: () => Promise<void>;
    refreshBookmarks: () => void;
}

/**
 * The EventContext instance.
 */
export const EventContext = createContext<EventContextType | undefined>(undefined);

/**
 * Custom hook to consume event data and controls.
 * Throws an error if used outside of an EventProvider.
 */
export const useEvents = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvents must be used within an EventProvider');
    }
    return context;
};
