import { useState } from "react";
import axios from "axios";
import "../styles/CreateCapoEventPage.css";

import type {EventRegDto, LocationDataType} from "../types/CapoEvent"; // adjust path
import type { CapoEventEnumType, RepetitionRhythmEnumType } from "../types/CapoEvent"; // adjust path
import type { AppUserType } from "../types/AppUser";
import {useNavigate} from "react-router-dom"; // adjust path

// ✅ Form state WITHOUT userId
type EventRegFormState = Omit<EventRegDto, "userId">;

type CreatePageProps = {
    user: AppUserType;
    fetchEvents: () => Promise<void>
}

export default function CreateCapoEventPage(props:Readonly<CreatePageProps>) {
    const [form, setForm] = useState<EventRegFormState>({
        eventType: "RODA",
        eventTitle: "",
        eventDescription: "",
        thumbnail: "",
        locationData: {
            country: "",
            state: "",
            city: "",
            street: "",
            streetNumber: "",
            specifics: "",
        },
        eventStart: "",
        eventEnd: "",

        repRhythm: "ONCE",
    });

    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    function updateField<K extends keyof EventRegFormState>(key: K, value: EventRegFormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function updateLocationField<K extends keyof LocationDataType>(key: K, value: LocationDataType[K]) {
        setForm((prev) => ({
            ...prev,
            locationData: { ...prev.locationData, [key]: value },
        }));
    }
    const nav = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        // Must be logged in (User must exist and have id)
        if (!props.user || !props.user.id) {
            setError("You must be logged in to create an event.");
            return;
        }

        const payload: EventRegDto = {
            userId: props.user.id,
            ...form,
        };

        try {
            await axios.post("/api/capoevent", payload)
                .then((r) => props.fetchEvents()
                    .then(() => nav("/")));
            setSuccessMsg("Event created!");
        } catch (err) {
            setError("Could not create event. Check backend / network.");
            console.error(err);
        }
    }

    const isLoggedIn = props.user !== null && props.user !== undefined;

    return (
        <main className="create-event">
            <h1 className="create-event__title">Create Capoeira Event</h1>

            {!isLoggedIn && (
                <div className="create-event__alert create-event__alert--error">
                    You are not logged in. Please log in to create events.
                </div>
            )}

            {error && <div className="create-event__alert create-event__alert--error">{error}</div>}
            {successMsg && (
                <div className="create-event__alert create-event__alert--success">{successMsg}</div>
            )}

            <form className="create-event__form" onSubmit={handleSubmit}>
                <fieldset className="create-event__fieldset">
                    <legend className="create-event__legend">Basic</legend>

                    <label className="create-event__label">
                        * Event Type
                        <select
                            className="create-event__select"
                            value={form.eventType}
                            onChange={(e) => updateField("eventType", e.target.value as CapoEventEnumType)}
                            required={true}
                        >
                            <option value="RODA">RODA</option>
                            <option value="WORKSHOP">WORKSHOP</option>
                        </select>
                    </label>

                    <label className="create-event__label">
                        * Title
                        <input
                            className="create-event__input"
                            value={form.eventTitle}
                            onChange={(e) => updateField("eventTitle", e.target.value)}
                            placeholder="e.g. Weekly Roda"
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        Description
                        <textarea
                            className="create-event__textarea"
                            value={form.eventDescription}
                            onChange={(e) => updateField("eventDescription", e.target.value)}
                            placeholder="What is this event about?"
                            rows={4}
                        />
                    </label>

                    <label className="create-event__label">
                        Thumbnail URL
                        <input
                            className="create-event__input"
                            value={form.thumbnail}
                            onChange={(e) => updateField("thumbnail", e.target.value)}
                            placeholder="https://..."
                        />
                    </label>
                </fieldset>

                <fieldset className="create-event__fieldset">
                    <legend className="create-event__legend">Location</legend>

                    <label className="create-event__label">
                        * Country
                        <input
                            className="create-event__input"
                            value={form.locationData.country}
                            onChange={(e) => updateLocationField("country", e.target.value)}
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        * State
                        <input
                            className="create-event__input"
                            value={form.locationData.state}
                            onChange={(e) => updateLocationField("state", e.target.value)}
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        * City
                        <input
                            className="create-event__input"
                            value={form.locationData.city}
                            onChange={(e) => updateLocationField("city", e.target.value)}
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        Street
                        <input
                            className="create-event__input"
                            value={form.locationData.street}
                            onChange={(e) => updateLocationField("street", e.target.value)}
                        />
                    </label>

                    <label className="create-event__label">
                        Street Number
                        <input
                            className="create-event__input"
                            value={form.locationData.streetNumber}
                            onChange={(e) => updateLocationField("streetNumber", e.target.value)}
                        />
                    </label>

                    <label className="create-event__label">
                        Specifics
                        <input
                            className="create-event__input"
                            value={form.locationData.specifics}
                            onChange={(e) => updateLocationField("specifics", e.target.value)}
                            placeholder="e.g. 2nd floor, ring bell"
                        />
                    </label>
                </fieldset>

                <fieldset className="create-event__fieldset">
                    <legend className="create-event__legend">Time</legend>

                    <label className="create-event__label">
                        * Event Start
                        <input
                            className="create-event__input"
                            type="datetime-local"
                            value={form.eventStart}
                            onChange={(e) => {
                                updateField("eventStart", e.target.value);
                                updateField("eventEnd", e.target.value)
                            }}
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        Event End
                        <input
                            className="create-event__input"
                            type="datetime-local"
                            value={form.eventEnd}
                            onChange={(e) => updateField("eventEnd", e.target.value)}
                            placeholder={form.eventStart}
                        />
                    </label>

                    <label className="create-event__label">
                        * Repetition Rhythm
                        <select
                            className="create-event__select"
                            value={form.repRhythm}
                            onChange={(e) => updateField("repRhythm", e.target.value as RepetitionRhythmEnumType)}
                            required={true}
                        >
                            <option value="ONCE">ONCE</option>
                            <option value="DAILY">DAILY</option>
                            <option value="WEEKLY">WEEKLY</option>
                            <option value="MONTHLY">MONTHLY</option>
                            <option value="YEARLY">YEARLY</option>
                            <option value="CUSTOM">CUSTOM</option>
                        </select>
                    </label>
                </fieldset>

                <button className="create-event__submit" type="submit" disabled={!isLoggedIn}>
                    Create Event
                </button>
            </form>
        </main>
    );
}
