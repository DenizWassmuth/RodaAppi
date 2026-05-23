import { createContext, useContext } from 'react';
import type { CapoEventType } from '../types/CapoEvent.ts';

export interface EventContextType {
    events: CapoEventType[];
    bookmarks: string[];
    bookmarkedSet: Set<string>;
    loading: boolean;
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
