import type {CapoEventType} from "../types/CapoEvent.ts";
import "../styles/CapoEventPreviewCard.css"
import "../index.css"
import {formatLocalDateTimeToDMonY, formatLocalDateTimeToHHmm} from "../utility/Helpers.ts";
import * as React from "react";
import {useAuth} from "../context/AuthContext.ts";
import {useEvents} from "../context/EventContext.ts";
import "tailwindcss";
import IconButton from "./buttons/IconButton.tsx";
import {BookmarkFillIcon, BookmarkLineIcon, DeleteBinLineIcon} from "../assets/Icons.tsx";
import EditLineIcon from "remixicon-react/EditLineIcon";

type EventCardProps = {
    capoEvent: CapoEventType
    onHandleEdit: (event: CapoEventType) => void;
    onHandleDelete: (event: CapoEventType) => void;
    openDetailsPage: (event: CapoEventType) => void;
}

export default function EventPreviewCard({
                                             capoEvent,
                                             onHandleEdit,
                                             onHandleDelete,
                                             openDetailsPage
                                         }: Readonly<EventCardProps>) {
    const {user} = useAuth();
    const {bookmarkedSet, toggleBookmark} = useEvents();

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
            className="relative min-h-100 max-sm:min-h-60 cursor-pointer overflow-hidden rounded-lg border-2 border-gray-500 hover:border-yellow-600 transition-colors duration-500 bg-zinc-300 hover:bg-zinc-50 bg-cover bg-center bg-blend-multiply text-zinc-200 "
        >
            {bShowButtons && (
                <div className="flex flex-row items-center justify-end pt-2 max-sm:pt-0 pr-2 max-sm:pr-0 gap-x-2 max-sm:gap-x-0 z-1">
                    {bIsCreatedByUser && (
                            <IconButton
                                buttonId={"editButton"}
                                title={"Edit"}
                                icon={EditLineIcon}
                                onClick={(e) => {
                                    preventCardClick(e);
                                    handleEdit();
                                }}
                                className={`max-sm:scale-75 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-700/25 bg-black/80 text-amber-400`}
                            /> )}
                    {bIsCreatedByUser && (
                            <IconButton
                                buttonId={"deleteButton"}
                                title={"Delete"}
                                icon={DeleteBinLineIcon}
                                onClick={(e) => {
                                    preventCardClick(e);
                                    handleDelete();
                                }}
                                className={"max-sm:scale-75 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-700/25 bg-black/80 text-amber-400"}
                            />
                    )}
                    <IconButton
                        buttonId={"bookmarkButton"}
                        title={bIsBookmarkedByUser ? "Remove bookmark" : "Add bookmark"}
                        icon={bIsBookmarkedByUser ? BookmarkFillIcon : BookmarkLineIcon}
                        onClick={(e) => {
                            preventCardClick(e);
                            handleBookmarking();
                        }}
                        className={`max-sm:scale-75 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-700/25 bg-black/80 text-amber-400`}
                    />
                </div>
            )}
            <div className="absolute inset-x-0 bottom-0 box-border flex h-auto min-h-50 items-end justify-between gap-3 bg-linear-to-t from-black/90 from-15% via-black/55 via-60% to-black/0 p-2 max-sm:p-1">
                <div className="flex min-w-0 flex-col gap-y-1 text-zinc-200">
                    <p className="text-xs">
                        {capoEvent?.eventType}
                    </p>
                    <h4 className="text-lg font-bold pl-0.5 max-sm:hidden">
                        {capoEvent?.eventTitle}
                    </h4>
                    <div className="flex flex-row items-center justify-start gap-x-2 pl-1 max-sm:pl-0.5">
                        <p className="text-sm">
                            {capoEvent?.locationData.city && (
                                capoEvent.locationData.city
                            )}
                            {!capoEvent?.locationData.city && capoEvent?.locationData.state && (
                                capoEvent.locationData.state
                            )}
                        </p>
                        <div className={"flex flex-row items-center justify-start gap-x-1"}>
                            <p className="text-sm">
                                {date}
                            </p>
                            <p className="text-sm max-sm:hidden">
                                · {time}
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}