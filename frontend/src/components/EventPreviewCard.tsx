import type {CapoEventType} from "../types/CapoEvent.ts";
import "../styles/CapoEventPreviewCard.css"
import "../index.css"
import {formatLocalDateTimeToDMonY, formatLocalDateTimeToHHmm} from "../utility/Helpers.ts";
import * as React from "react";
import {useAuth} from "../context/AuthContext.ts";
import {useEvents} from "../context/EventContext.ts";

type EventCardProps = {
    capoEvent: CapoEventType
    onHandleEdit: (event: CapoEventType) => void;
    onHandleDelete: (event: CapoEventType) => void;
    openDetailsPage: (event:CapoEventType) => void;
}

export default function EventPreviewCard({capoEvent, onHandleEdit, onHandleDelete, openDetailsPage}: Readonly<EventCardProps>) {
    const { user } = useAuth();
    const { bookmarkedSet, toggleBookmark } = useEvents();

    const bUserIsValid = !!user;
    const bEventIsValid = capoEvent !== undefined && capoEvent !== null;
    const bShowButtons = bUserIsValid && bEventIsValid;
    const bIsCreatedByUser = bShowButtons && user?.id === capoEvent.creatorId;
    const bBookmarksNotNull = bookmarkedSet !== null && bookmarkedSet.size >= 0;
    const bIsBookmarkedByUser = bShowButtons && bBookmarksNotNull && bookmarkedSet.has(capoEvent?.id)

    function handleDelete() {
        if (!capoEvent) {
            console.log("capoEvent === null or undefined, cannot open delete modal");
            return;
        }
        onHandleDelete(capoEvent); // open modal from parent
    }

    function handleEdit() {
        if (!capoEvent) {
            console.log("capoEvent === null or undefined, cannot open edit modal");
            return;
        }
        onHandleEdit(capoEvent); // open modal from parent
    }

    async function handleBookmarking() {
        if (!capoEvent) {
            console.log("capoEvent === null or undefined, cannot handle bookmarks");
            return;
        }
        await toggleBookmark(capoEvent.id);
    }

    function handleOpenDetails() {
        openDetailsPage(capoEvent);
    }

    const preventCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const eventstart: string | undefined = capoEvent?.eventStart;
    const date = formatLocalDateTimeToDMonY(eventstart);
    const time = formatLocalDateTimeToHHmm(eventstart);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleOpenDetails}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenDetails();
                }
            }}
            style={{backgroundImage: `url(${capoEvent?.thumbnail})`}}
            className="event_card"
        >
            {bShowButtons && (
                <button
                    type="button"
                    className="event_bookmark"
                    onClick={(e) => {
                        preventCardClick(e);
                        handleBookmarking();
                    }}
                    aria-label={bIsBookmarkedByUser ? "Remove bookmark" : "Add bookmark"}
                    title={bIsBookmarkedByUser ? "Remove bookmark" : "Add bookmark"}
                >
                    <span className="event_bookmark_icon"> {bIsBookmarkedByUser ? "★" : "☆"} </span>
                </button>
            )}
            <div className="event_info">
                <div className="event_left">
                    <h4 className="event_title">{capoEvent?.eventTitle}</h4>
                    <p className="event_meta">
                        {capoEvent?.eventType + " · "}
                        {capoEvent?.locationData.city && (
                            capoEvent.locationData.city + " · "
                        )}
                        {!capoEvent?.locationData.city && capoEvent?.locationData.state && (
                            capoEvent.locationData.state + " · "
                        )}
                        {date} · {time}
                    </p>
                </div>

                {bIsCreatedByUser && (
                    <div className="event_actions_bottom_right">

                        <button
                            type="button"
                            className="event_btn"
                            onClick={(e) => {
                                preventCardClick(e);
                                handleEdit();
                            }}
                        >
                            edit
                        </button>

                        <button
                            type="button"
                            className="event_btn"
                            onClick={(e) => {
                                preventCardClick(e);
                                handleDelete();
                            }}
                        >
                            delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}