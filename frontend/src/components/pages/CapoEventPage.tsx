import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {CapoEventType, EditScope, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import axios from "axios";
import "../../styles/CapoEventPage.css"
import type {AppUserType} from "../../types/AppUser.ts";
import {checkIfPartOfSeries, deleteCapoEvent} from "../../utility/AxiosUtilities.ts";

type EventPageProps = {
    user: AppUserType
    fetchEvents:() => Promise<void | string>
}

export default function CapoEventPage(props: Readonly<EventPageProps>) {

    const { id } = useParams();
    const nav = useNavigate();
    const [capoEvent, setCapoEvent] = useState<CapoEventType>();

    const [deleteOption, setDeleteOption] = useState(false);
    const [deleteScope, setDeleteScope] = useState<EditScope>("ONLY_THIS");
    const [partOfSeries, setPartOfSeries] = useState<PartOfSeriesDto>(null);

    const isLoggedIn = props.user !== null && props.user !== undefined;
    const eventIsValid = capoEvent !== undefined && capoEvent !== null;
    const eventIsCreatedByUser = isLoggedIn && eventIsValid && props.user.id === capoEvent?.creatorId;

    useEffect(() => {
        axios.get("/api/capoevent/" + id).then((r) => setCapoEvent(r.data));
    }, [id]);

    function handleDelete() {
        deleteCapoEvent(props.user?.id, capoEvent?.id, deleteScope)
            .then(() => {
                setPartOfSeries(null);
                setDeleteScope("ONLY_THIS");
            })
            .catch((error) => {
                console.log("could not delete capoEvent through CapoEventPage: " + error.toString());
            });
    }

    function editEvent(eventId: string | undefined) {
        if (!eventId) {
            console.log("eventId === null or undefined, cannot move on to edit page");
            return;
        }
        nav("/edit/" + eventId);
    }

    const start = capoEvent?.eventStart ? capoEvent.eventStart.replace("T", " ") : "";
    const end = capoEvent?.eventEnd ? capoEvent.eventEnd.replace("T", " ") : "";

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
                    <legend className="create-event__legend">Basic</legend>

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
                                onClick={() =>
                                    checkIfPartOfSeries(capoEvent, setPartOfSeries).then(() => setDeleteOption(true))
                                }
                            >
                                delete
                            </button>

                            <button
                                className="create-event__submit capo-detail__btn"
                                type="button"
                                disabled={!eventIsCreatedByUser}
                                onClick={() => editEvent(capoEvent?.id)}
                            >
                                edit
                            </button>
                        </div>
                    </fieldset>
                }

            </section>

            {/* You already have deleteOption/partOfSeries/deleteScope states; wire your modal here if needed */}
            {/* Example:
            <DeleteOptionsModal
                open={deleteOption}
                partOfSeries={partOfSeries}
                deleteScope={deleteScope}
                setDeleteScope={setDeleteScope}
                onConfirm={async () => {
                    setDeleteOption(false);
                    handleDelete();
                }}
                onCancel={() => setDeleteOption(false)}
            />
            */}
        </main>
    );
}