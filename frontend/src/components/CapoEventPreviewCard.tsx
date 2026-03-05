import type {CapoEventType} from "../types/CapoEvent.ts";
import "../styles/CapoEventPreviewCard.css"
import "../index.css"
import type {AppUserType} from "../types/AppUser.ts";
import {bookmarkEvent} from "../utility/AxiosUtilities.ts";
import {formatLocalDateTimeToDMonY, formatLocalDateTimeToHHmm} from "../utility/Helpers.ts";
import * as React from "react";

type EventCardProps = {
    user: AppUserType | undefined | null
    capoEvent: CapoEventType
    bookmarkedSet: ReadonlySet<string> | null;
    onHandleEdit: (event: CapoEventType) => void;
    onHandleDelete: (event: CapoEventType) => void;
    openDetailsPage: (event:CapoEventType) => void;
    onHandleGetBookmarks: () => void;
}

export default function CapoEventPreviewCard({user, capoEvent, bookmarkedSet, onHandleEdit, onHandleDelete, onHandleGetBookmarks, openDetailsPage}: Readonly<EventCardProps>) {

    const bUserIsValid = user !== null && user !== undefined;
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

    function handleBookmarking() {
        if (!capoEvent) {
            console.log("capoEvent === null or undefined, cannot handle bookmarks");
            return;
        }
        bookmarkEvent(user?.id, capoEvent?.id, bIsBookmarkedByUser)
            .then(() => onHandleGetBookmarks());
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
            className="event_card"
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