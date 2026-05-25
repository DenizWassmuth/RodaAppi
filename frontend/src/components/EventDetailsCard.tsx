import type {CapoEventType, PartOfSeriesDto} from "../types/CapoEvent.ts";
import "../styles/CapoEventDetailsCard.css"
import {formatLocalDateTimeToDMonY, formatLocalDateTimeToHHmm,} from "../utility/Helpers.ts";
import {useAuth} from "../context/AuthContext.ts";
import {useEvents} from "../context/EventContext.ts";
import IconButton from "./buttons/IconButton.tsx";
import {BookmarkFillIcon, BookmarkLineIcon, DeleteBinLineIcon} from "../assets/Icons.tsx";
import EditLineIcon from "remixicon-react/EditLineIcon";
import "tailwindcss";

type EventPageProps = {
    bOpen: boolean;
    capoEvent: CapoEventType;
    partOfSeries: PartOfSeriesDto;
    onEdit: () => void;
    onDelete: () => void;
}

export default function EventDetailsCard({bOpen, capoEvent, onEdit, onDelete}: Readonly<EventPageProps>) {
    const { user } = useAuth();
    const { bookmarkedSet, toggleBookmark } = useEvents();

    const isLoggedIn = !!user;
    const eventIsValid = capoEvent !== undefined && capoEvent !== null;
    const bIsCreatedByUser = isLoggedIn && eventIsValid && user.id === capoEvent?.creatorId;

    const bBookmarksNotNull = bookmarkedSet !== null && bookmarkedSet.size >= 0;
    const bIsBookmarkedByUser = isLoggedIn && bBookmarksNotNull && bookmarkedSet.has(capoEvent?.id ?? "")

    if (!bOpen) {
        return null;
    }

    function handleDelete() {
        onDelete();
    }

    function handleEdit() {
        onEdit();
    }

    async function handleBookmarking()
    {
        await toggleBookmark(capoEvent?.id ?? "");
    }

    const endDate = formatLocalDateTimeToDMonY(capoEvent?.eventEnd);
    const endTime = formatLocalDateTimeToHHmm(capoEvent?.eventEnd);

    const startDate = formatLocalDateTimeToDMonY(capoEvent?.eventStart);
    const startTime = formatLocalDateTimeToHHmm(capoEvent?.eventStart);

    if (!capoEvent) return <p style={{ color: "white" }}>Loading...</p>;

    return (
        <main className="details">
            <header className="details__banner">
                <div className="details__titlebar">
                    <h1 className="details__title">
                        {capoEvent?.eventType}
                    </h1>
                    <p className="details__postedby">
                        <span className="details__postedby-name">
                            {"posted by " + capoEvent?.creatorName}
                        </span>
                    </p>
                    <div className={"flex flex-row items-start justify-end gap-x-2"}>
                        {isLoggedIn && (
                            <IconButton
                                buttonId={"bookmarkButton"}
                                title={bIsBookmarkedByUser ? "Remove bookmark" : "Add bookmark"}
                                icon={bIsBookmarkedByUser ? BookmarkFillIcon : BookmarkLineIcon}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleBookmarking();
                                }}
                                className={`max-sm:scale-75 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-700/25 bg-black/80 text-amber-400`}
                            />
                        )}
                        {bIsCreatedByUser && (
                            <IconButton
                                buttonId={"editButton"}
                                title={"Edit"}
                                icon={EditLineIcon}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
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
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                className={"max-sm:scale-75 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-700/25 bg-black/80 text-amber-400"}
                            />
                        )}
                    </div>
                </div>
                <img className="details__banner-img" src={capoEvent?.thumbnail} alt="Thumbnail"/>
                <div className="details__banner-overlay">
                    <span className="details__value">
                        {capoEvent?.locationData.street} {capoEvent?.locationData.streetNumber}
                    </span>
                    <p className="details__subtitle">
                        {capoEvent?.locationData.city && (
                            capoEvent.locationData.city + " · "
                        )}
                        {capoEvent?.locationData.state && (
                            capoEvent.locationData.state + " · "
                        )}
                        {capoEvent?.locationData.country && (
                            capoEvent.locationData.country
                        )}
                    </p>
                    <p className="details__subtitle">
                        {startDate + " · "} {startTime}  {capoEvent.eventType.match("WORKSHOP") &&(" - " + endDate + " · " + endTime)}
                    </p>
                </div>
            </header>
            <section className="details__grid">
                {capoEvent?.eventDescription && (
                    <fieldset className="details__fieldset">
                        <legend className="details__legend">{capoEvent.eventTitle ? capoEvent.eventTitle : "event description"}</legend>
                        <div className="details__row details__row--longtext">
                            <span className="details__value details__value--longtext">
                                {capoEvent.eventDescription}
                            </span>
                        </div>
                    </fieldset>
                )}
                {capoEvent?.locationData.specifics && (
                    <fieldset className="details__fieldset">
                        <legend className="details__legend">location specifics</legend>
                        <div className="details__row details__row--longtext">
                            <span className="details__value details__value--longtext">
                                {capoEvent.locationData.specifics}
                            </span>
                        </div>
                    </fieldset>
                )}
            </section>
        </main>
    );
}