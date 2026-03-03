
import type {CapoEventType, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import "../../styles/CapoEventDetailsCard.css"
import type {AppUserType} from "../../types/AppUser.ts";
import {formatLocalDateTimeToDMonY, formatLocalDateTimeToHHmm, hasSameDate} from "../../utility/Helpers.ts";
import {bookmarkEvents} from "../../utility/AxiosUtilities.ts";

type EventPageProps = {
    bOpen: boolean;
    user: AppUserType;
    capoEvent: CapoEventType;
    partOfSeries: PartOfSeriesDto;
    onEdit: () => void;
    onDelete: () => void;
    bookmarks:string[] | null;
    fetchEvents: () => void;
}

export default function CapoEventDetailsCard({bOpen, user, capoEvent, onEdit, onDelete, bookmarks, fetchEvents}: Readonly<EventPageProps>) {

    const isLoggedIn = user !== null && user !== undefined;
    const eventIsValid = capoEvent !== undefined && capoEvent !== null;
    const eventIsCreatedByUser = isLoggedIn && eventIsValid && user.id === capoEvent?.creatorId;

    const bBookmarksNotNull = bookmarks !== null && bookmarks.length >= 0;
    const bIsBookmarkedByUser = isLoggedIn && bBookmarksNotNull && bookmarks.includes(capoEvent?.id ?? "")

    if (!bOpen) {
        return null;
    }

    function handleDelete() {
        onDelete();
    }

    function handleEdit() {
        onEdit();
    }

    function handleBookmarking()
    {
        bookmarkEvents(user?.id, capoEvent?.id, bIsBookmarkedByUser)
            .then(() => {
                fetchEvents()
            })
    }

    const endDate = formatLocalDateTimeToDMonY(capoEvent?.eventEnd);
    const endTime = formatLocalDateTimeToHHmm(capoEvent?.eventEnd);

    const startDate = formatLocalDateTimeToDMonY(capoEvent?.eventStart);
    const startTime = formatLocalDateTimeToHHmm(capoEvent?.eventStart);

    const bHasSameDate = hasSameDate(startDate, endDate);

    if (!capoEvent) return <p style={{ color: "white" }}>Loading...</p>;

    return (
        <main className="details">
            <header className="details__banner">
                <div className="details__titlebar">
                    <h1 className="details__title">{capoEvent?.eventType}</h1>
                    <p className="details__postedby">
                        posted by <span className="details__postedby-name">{capoEvent?.creatorName}</span>
                    </p>
                    {isLoggedIn && (
                        <button
                            type="button"
                            className="details__bookmark details__bookmark--floating"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleBookmarking();
                            }}
                            aria-label={bIsBookmarkedByUser ? "Remove bookmark" : "Add bookmark"}
                            title={bIsBookmarkedByUser ? "Remove bookmark" : "Add bookmark"}
                        >
                            <span className="details__bookmark_icon">{bIsBookmarkedByUser ? "★" : "☆"}</span>
                        </button>
                    )}
                </div>
                <img className="details__banner-img" src={capoEvent?.thumbnail} alt="Thumbnail"/>
                <div className="details__banner-overlay">
                    <h1 className="details__banner-title">

                    </h1>
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
                        {startDate + " · "} {startTime + " - "}  {!bHasSameDate &&(endDate + " · ")}  {endTime}
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

                {eventIsCreatedByUser && (
                    <div className="details__floating-actions">

                        <button
                            className="details__btn"
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                handleEdit();
                            }}
                        >
                            edit
                        </button>

                        <button
                            className="details__btn details__btn--danger"
                            type="button"
                            disabled={!eventIsCreatedByUser}
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                        >
                            delete
                        </button>

                    </div>
                )}
            </section>
        </main>
    );
}