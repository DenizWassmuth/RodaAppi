
import type {CapoEventType, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import "../../styles/CapoEventPage.css"
import type {AppUserType} from "../../types/AppUser.ts";

type EventPageProps = {
    bOpen: boolean;
    user: AppUserType;
    capoEvent: CapoEventType;
    partOfSeries: PartOfSeriesDto;
    onEdit: () => void;
    onDelete: () => void;
}

export default function CapoEventDetailsCard({bOpen ,user, capoEvent, onEdit, onDelete}: Readonly<EventPageProps>) {

    const isLoggedIn = user !== null && user !== undefined;
    const eventIsValid = capoEvent !== undefined && capoEvent !== null;
    const eventIsCreatedByUser = isLoggedIn && eventIsValid && user.id === capoEvent?.creatorId;

    if (!bOpen) {
        return null;
    }

    function handleDelete() {
        onDelete();
    }

    function handleEdit() {
        onEdit();
    }

    const start = capoEvent?.eventStart.replace("T", " ");
    const end = capoEvent?.eventEnd.replace("T", " ");

    if (!capoEvent) return <p style={{ color: "white" }}>Loading...</p>;

    return (
        <main className="capo-detail">
            <header className="capo-detail__banner">
                <img className="capo-detail__banner-img" src={capoEvent?.thumbnail} alt="Thumbnail" />
                <div className="capo-detail__banner-overlay">
                    <h1 className="capo-detail__title">{capoEvent?.eventTitle}</h1>
                    <p className="capo-detail__subtitle">
                        {capoEvent?.eventType} · {capoEvent?.locationData.country} · {capoEvent?.locationData.city}
                    </p>
                </div>
            </header>

            <section className="capo-detail__grid">
                <fieldset className="create-event__fieldset">

                    <div className="capo-detail__row">
                        <span className="capo-detail__label">Title</span>
                        <span className="capo-detail__value">{capoEvent?.eventTitle}</span>
                    </div>

                    <div className="capo-detail__row">
                        <span className="capo-detail__label">Description</span>
                        <span className="capo-detail__value">{capoEvent?.eventDescription}</span>
                    </div>

                    <div className="capo-detail__row">
                        <span className="capo-detail__label">Creator</span>
                        <span className="capo-detail__value">{capoEvent?.creatorName}</span>
                    </div>
                </fieldset>

                <fieldset className="create-event__fieldset">
                    <legend className="create-event__legend">Location</legend>

                    <div className="capo-detail__row">
                        <span className="capo-detail__label">Country</span>
                        <span className="capo-detail__value">{capoEvent?.locationData.country}</span>
                    </div>

                    <div className="capo-detail__row">
                        <span className="capo-detail__label">State</span>
                        <span className="capo-detail__value">{capoEvent?.locationData.state}</span>
                    </div>

                    <div className="capo-detail__row">
                        <span className="capo-detail__label">City</span>
                        <span className="capo-detail__value">{capoEvent?.locationData.city}</span>
                    </div>

                    <div className="capo-detail__row">
                        <span className="capo-detail__label">Street</span>
                        <span className="capo-detail__value">
                            {capoEvent?.locationData.street} {capoEvent?.locationData.streetNumber}
                        </span>
                    </div>

                    {capoEvent?.locationData.specifics && (
                        <div className="capo-detail__row">
                            <span className="capo-detail__label">Specifics</span>
                            <span className="capo-detail__value">{capoEvent.locationData.specifics}</span>
                        </div>
                    )}
                </fieldset>

                <fieldset className="create-event__fieldset">
                    <legend className="create-event__legend">Time</legend>

                    <div className="capo-detail__row">
                        <span className="capo-detail__label">Start</span>
                        <span className="capo-detail__value">{start}</span>
                    </div>

                    <div className="capo-detail__row">
                        <span className="capo-detail__label">End</span>
                        <span className="capo-detail__value">{end}</span>
                    </div>
                </fieldset>

                {eventIsCreatedByUser &&
                    <fieldset className="create-event__fieldset">
                        <legend className="create-event__legend">Actions</legend>

                        <div className="capo-detail__actions">
                            <button
                                className="create-event__submit capo-detail__btn"
                                type="button"
                                disabled={!eventIsCreatedByUser}
                                onClick={handleDelete}
                            >
                                delete
                            </button>

                            <button
                                className="create-event__submit capo-detail__btn"
                                type="button"
                                disabled={!eventIsCreatedByUser}
                                onClick={handleEdit}
                            >
                                edit
                            </button>
                        </div>
                    </fieldset>
                }
            </section>
        </main>
    );
}