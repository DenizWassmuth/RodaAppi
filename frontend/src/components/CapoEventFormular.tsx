import { useState } from "react";

import "../styles/CreateCapoEventPage.css";
import type {CapoEventEnumType, EventFormValue, RepetitionRhythmEnumType} from "../types/CapoEvent.ts";


type EventFormularProps = {
    title: string;
    submitText: string;
    initialValue: EventFormValue;
    onSubmit: (value: EventFormValue) => Promise<void>;
};

export default function CapoEventForm(props: EventFormularProps) {
    const [value, setValue] = useState<EventFormValue>(props.initialValue);
    const [error, setError] = useState<string | null>(null);

    function updateField<K extends keyof EventFormValue>(key: K, v: EventFormValue[K]) {
        setValue((prev) => ({...prev, [key]: v}));
    }

    function updateLocationField<K extends keyof EventFormValue["locationData"]>(
        key: K,
        v: EventFormValue["locationData"][K]
    ) {
        setValue((prev) => ({
            ...prev,
            locationData: {...prev.locationData, [key]: v},
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        try {
            await props.onSubmit(value);
        } catch (e) {
            setError("Submit failed. Check console / backend.");
            console.error(e);
        }
    }

    return (
        <main className="create-event">
            <h1 className="create-event__title">Create Capoeira Event</h1>

            {error && <div className="create-event__alert create-event__alert--error">{error}</div>}

            <form className="create-event__form" onSubmit={handleSubmit}>
                <fieldset className="create-event__fieldset">
                    <legend className="create-event__legend">Basic</legend>

                    <label className="create-event__label">
                        * Event Type
                        <select
                            className="create-event__select"
                            value={value.eventType}
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
                            value={value.eventTitle}
                            onChange={(e) => updateField("eventTitle", e.target.value)}
                            placeholder="e.g. Weekly Roda"
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        Description
                        <textarea
                            className="create-event__textarea"
                            value={value.eventDescription}
                            onChange={(e) => updateField("eventDescription", e.target.value)}
                            placeholder="What is this event about?"
                            rows={4}
                        />
                    </label>

                    <label className="create-event__label">
                        Thumbnail URL
                        <input
                            className="create-event__input"
                            value={value.thumbnail}
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
                            value={value.locationData.country}
                            onChange={(e) => updateLocationField("country", e.target.value)}
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        * State
                        <input
                            className="create-event__input"
                            value={value.locationData.state}
                            onChange={(e) => updateLocationField("state", e.target.value)}
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        * City
                        <input
                            className="create-event__input"
                            value={value.locationData.city}
                            onChange={(e) => updateLocationField("city", e.target.value)}
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        Street
                        <input
                            className="create-event__input"
                            value={value.locationData.street}
                            onChange={(e) => updateLocationField("street", e.target.value)}
                        />
                    </label>

                    <label className="create-event__label">
                        Street Number
                        <input
                            className="create-event__input"
                            value={value.locationData.streetNumber}
                            onChange={(e) => updateLocationField("streetNumber", e.target.value)}
                        />
                    </label>

                    <label className="create-event__label">
                        Specifics
                        <input
                            className="create-event__input"
                            value={value.locationData.specifics}
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
                            value={value.eventStart}
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
                            value={value.eventEnd}
                            onChange={(e) => updateField("eventEnd", e.target.value)}
                            placeholder={value.eventStart}
                        />
                    </label>

                    <label className="create-event__label">
                        * Repetition Rhythm
                        <select
                            className="create-event__select"
                            value={value.repRhythm}
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

                <button className="create-event__submit" type="submit">
                    {props.submitText}
                </button>
            </form>
        </main>
    );
}