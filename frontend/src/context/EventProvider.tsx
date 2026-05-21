import React, { useState, useMemo, useEffect, type ReactNode, useCallback } from 'react';
import axios from 'axios';
import type { CapoEventFilterDto, CapoEventType } from '../types/CapoEvent.ts';
import { fetchFilteredCapoEvents } from '../utility/AxiosUtilities.ts';
import { useAuth } from './AuthContext.ts';
import { useLocation } from 'react-router-dom';
import { EventContext } from './EventContext.ts';

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

/**
 * EventProvider centralizes the fetching and filtering of Capoeira events.
 * It uses the EventContext to provide data to the rest of the app.
 */
export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();
    
    // Core State: Current events list, filter settings, and user bookmarks
    const [events, setEvents] = useState<CapoEventType[]>([]);
    const [filters, setFilters] = useState<CapoEventFilterDto>(defaultFilters);
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Derived State: determine if we are currently on the dashboard route
    const bIsDashboard = location.pathname.startsWith("/loggedin");

    // Derived State: creates a Set for O(1) bookmark lookups in cards
    const bookmarkedSet = useMemo(() => new Set(bookmarks), [bookmarks]);

    /**
     * Logic to determine the "Effective Filters" based on current page and user.
     * It ensures the backend receives the correct IDs and flags.
     */
    const effectiveFilters = useMemo<CapoEventFilterDto>(() => {
        if (bIsDashboard && user) {
            return { ...filters, isDashboardContent: true, creatorId: user.id };
        }

        if (filters.bookmarkedOnly && user) {
            return { ...filters, isDashboardContent: false, creatorId: user.id };
        }

        // Default: Show all public events
        return { ...filters, isDashboardContent: false, creatorId: undefined, bookmarkedOnly: false };
    }, [user, filters, bIsDashboard]);

    /**
     * Fetches events based on the current effective filters.
     * Wrapped in useCallback to prevent unnecessary re-renders of components using this function.
     */
    const refreshEvents = useCallback(async () => {
        setLoading(true);
        try {
            await fetchFilteredCapoEvents(effectiveFilters, setEvents);
        } finally {
            setLoading(false);
        }
    }, [effectiveFilters]);

    /**
     * Fetches user bookmarks from the backend.
     */
    const refreshBookmarks = useCallback(() => {
        if (!user?.id) {
            setBookmarks([]);
            return;
        }

        axios.get<string[]>(`/api/bookmarks/${user.id}`)
            .then((response) => setBookmarks(response.data))
            .catch((error) => {
                console.error("Could not fetch bookmarks:", error);
                setBookmarks([]);
            });
    }, [user?.id]);

    // Re-fetch events whenever effective filters (page, search criteria) change
    useEffect(() => {
        refreshEvents();
    }, [refreshEvents]);

    // Re-fetch bookmarks whenever the user switches or logs in/out
    useEffect(() => {
        refreshBookmarks();
    }, [refreshBookmarks]);

    return (
        <EventContext.Provider value={{
            events,
            filters,
            bookmarks,
            bookmarkedSet,
            loading,
            setFilters,
            refreshEvents,
            refreshBookmarks
        }}>
            {children}
        </EventContext.Provider>
    );
};
