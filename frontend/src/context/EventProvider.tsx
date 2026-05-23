import React, { useState, useMemo, useEffect, type ReactNode, useCallback } from 'react';
import axios from 'axios';
import type { CapoEventFilterDto, CapoEventType } from '../types/CapoEvent.ts';
import { fetchFilteredEvents, bookmarkEvent } from '../utility/AxiosUtilities.ts';
import { useAuth } from './AuthContext.ts';
import { useLocation } from 'react-router-dom';
import { EventContext } from './EventContext.ts';
import { useFilters } from './FilterContext.ts';

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { filters } = useFilters();
    const location = useLocation();

    // Core State: Current events list and user bookmarks
    const [events, setEvents] = useState<CapoEventType[]>([]);
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const bIsDashboard = location.pathname.startsWith("/loggedin");

    const bookmarkedSet = useMemo(() => new Set(bookmarks), [bookmarks]);

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


    const refreshEvents = useCallback(async () => {
        setLoading(true);
        try {
            await fetchFilteredEvents(effectiveFilters, setEvents);
        } finally {
            setLoading(false);
        }
    }, [effectiveFilters]);

    useEffect(() => {
        refreshEvents();
    }, [refreshEvents]);

    const refreshBookmarks = useCallback(async () => {
        if (!user?.id) {
            setBookmarks([]);
            return;
        }

        try {
            const response = await axios.get<string[]>(`/api/bookmarks/${user.id}`);
            setBookmarks(response.data);
        } catch (error) {
            console.error("Could not fetch bookmarks:", error);
            setBookmarks([]);
        }
    }, [user?.id]);

    const toggleBookmark = useCallback(async (eventId: string) => {
        if (!user?.id) return;

        const isCurrentlyBookmarked = bookmarkedSet.has(eventId);

        // Optimistic Update: immediately update the UI
        setBookmarks(prev =>
            isCurrentlyBookmarked
                ? prev.filter(id => id !== eventId)
                : [...prev, eventId]
        );

        try {
            await bookmarkEvent(user.id, eventId, isCurrentlyBookmarked);
        } catch (error) {
            console.error("Failed to toggle bookmark:", error);
            // Sync with backend to revert optimistic change on failure
            await refreshBookmarks();
            return;
        }

        await refreshBookmarks();

        if (filters.bookmarkedOnly) {
            await refreshEvents();
        }

    }, [user?.id, bookmarkedSet, filters.bookmarkedOnly, refreshBookmarks, refreshEvents]);

    useEffect(() => {
        refreshBookmarks();
    }, [refreshBookmarks]);

    return (
        <EventContext.Provider
            value={{
                events,
                bookmarks,
                bookmarkedSet,
                loading,
                refreshEvents,
                refreshBookmarks,
                toggleBookmark
            }}
        >
            {children}
        </EventContext.Provider>
    );
};
