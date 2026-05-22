import { createContext, useContext } from 'react';
import type { CapoEventFilterDto, CapoEventType } from '../types/CapoEvent.ts';

export interface EventContextType {
    events: CapoEventType[];
    filters: CapoEventFilterDto;
    bookmarks: string[];
    bookmarkedSet: Set<string>;
    loading: boolean;
    setFilters: React.Dispatch<React.SetStateAction<CapoEventFilterDto>>;
    refreshEvents: () => Promise<void>;
    refreshBookmarks: () => Promise<void>;
    toggleBookmark: (eventId: string) => Promise<void>;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvents must be used within an EventProvider');
    }
    return context;
};
