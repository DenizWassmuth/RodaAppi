import {type FormEvent, useMemo, useState} from "react";

import "../styles/CapoEventForm.css";
import type {
    CapoEventEnumType,
    EditScope,
    EventFormValue,
    PartOfSeriesDto,
    RepetitionRhythmEnumType
} from "../types/CapoEvent.ts";
import EditScopeModal from "./modals/EditScopeModal.tsx";


type EventFormProps = {
    submitText: string;
    initialValue: EventFormValue;
    submit: (value: EventFormValue, scope:EditScope | null) => Promise<void>;
    bEditMode: boolean;
    partOfSeries: PartOfSeriesDto
};

// Every line commented.
function nowAsDateTimeLocal(): string { // Helper to format current time for datetime-local input.
    const d = new Date(); // Current date/time in browser timezone.
    d.setSeconds(0, 0); // Remove seconds/ms because datetime-local usually uses minutes.
    const pad = (n: number) => String(n).padStart(2, "0"); // Zero-pad helper.
    const yyyy = d.getFullYear(); // Year.
    const mm = pad(d.getMonth() + 1); // Month (0-based).
    const dd = pad(d.getDate()); // Day.
    const hh = pad(d.getHours()); // Hour.
    const min = pad(d.getMinutes()); // Minute.
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`; // Format required by datetime-local.
}

export default function CapoEventForm({submitText, initialValue, submit, bEditMode, partOfSeries}: Readonly<EventFormProps>) {

    const [editScope, setEditScope] = useState<EditScope>("ONLY_THIS");

    const [value, setValue] = useState<EventFormValue>(initialValue);
    const [error, setError] = useState<string | null>(null);
    const [openEditScopeModal, setOpenEditScopeModal] = useState<boolean>(false);

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

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (bEditMode) {
            setOpenEditScopeModal(true);
            return;
        }

      submit(value, null)
          .catch((err: Error) => {console.log("SUBMIT FAILED: " + err)});
    }



    const minStart = useMemo(() => nowAsDateTimeLocal(), []); // Compute once on mount.

    const showRepUntil = value.repRhythm !== "ONCE" && !bEditMode;

    return (
        <main className="create-event">
            <h1 className="create-event__title">{submitText} Capoeira Event</h1>
            <form className="create-event__form" onSubmit={handleSubmit}>
                <fieldset className="create-event__fieldset">
                    <legend className="create-event__legend">Basic</legend>

                    {error && <div className="create-event__alert create-event__alert--error">{error}</div>}

                    <label className="create-event__label">
                        <span>Event Type</span>
                        <select
                            className="create-event__select"
                            value={value.eventType}
                            onChange={(e) => updateField("eventType", e.target.value as CapoEventEnumType)}
                            required={true}
                            disabled={bEditMode}
                        >
                            <option value="RODA">RODA</option>
                            <option value="WORKSHOP">WORKSHOP</option>
                        </select>
                    </label>

                    <label className="create-event__label">
                        <span>Title</span>
                        <input
                            className="create-event__input"
                            value={value.eventTitle}
                            onChange={(e) => updateField("eventTitle", e.target.value)}
                            placeholder="e.g. Weekly Roda"
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        <span>Description</span>
                        <textarea
                            className="create-event__textarea"
                            value={value.eventDescription}
                            onChange={(e) => updateField("eventDescription", e.target.value)}
                            placeholder="What is this event about?"
                            rows={4}
                        />
                    </label>

                    <label className="create-event__label">
                        <span>Thumbnail URL</span>
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
                        <span>Country</span>
                        <input
                            className="create-event__input"
                            value={value.locationData.country}
                            onChange={(e) => updateLocationField("country", e.target.value)}
                            required={true}
                            disabled={bEditMode}
                        />
                    </label>

                    <label className="create-event__label">
                        <span>State</span>
                        <input
                            className="create-event__input"
                            value={value.locationData.state}
                            onChange={(e) => updateLocationField("state", e.target.value)}
                            required={true}
                            disabled={bEditMode}
                        />
                    </label>

                    <label className="create-event__label">
                        <span>City</span>
                        <input
                            className="create-event__input"
                            value={value.locationData.city}
                            onChange={(e) => updateLocationField("city", e.target.value)}
                            required={true}
                            disabled={bEditMode}
                        />
                    </label>

                    <label className="create-event__label">
                        <span>Street</span>
                        <input
                            className="create-event__input"
                            value={value.locationData.street}
                            onChange={(e) => updateLocationField("street", e.target.value)}
                        />
                    </label>

                    <label className="create-event__label">
                        <span>Street Number</span>
                        <input
                            className="create-event__input"
                            value={value.locationData.streetNumber}
                            onChange={(e) => updateLocationField("streetNumber", e.target.value)}
                        />
                    </label>

                    <label className="create-event__label">
                        <span>Specifics</span>
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
                        <span>Event Start</span>
                        <input
                            className="create-event__input"
                            type="datetime-local"
                            min={minStart}
                            value={value.eventStart}
                            onChange={(e) => {
                                updateField("eventStart", e.target.value);
                                updateField("eventEnd", e.target.value);
                                updateField("repUntil", e.target.value);
                                console.log(e.target.value);
                                console.log(value.eventStart);
                            }}
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        <span>Event End</span>
                        <input
                            className="create-event__input"
                            type="datetime-local"
                            min={value.eventStart || minStart}
                            value={value.eventEnd}
                            onChange={(e) => {
                                updateField("eventEnd", e.target.value);
                                updateField("repUntil", e.target.value);
                            }}
                            placeholder={value.eventStart}
                        />
                    </label>

                    <label className="create-event__label">
                        <span>Repetition Rhythm</span>
                        <select
                            className="create-event__select"
                            value={value.repRhythm}
                            onChange={(e) => updateField("repRhythm", e.target.value as RepetitionRhythmEnumType)}
                            required={true}
                            disabled={bEditMode}
                        >
                            <option value="ONCE">ONCE</option>
                            <option value="DAILY">DAILY</option>
                            <option value="WEEKLY">WEEKLY</option>
                            <option value="MONTHLY">MONTHLY</option>
                            <option value="YEARLY">YEARLY</option>
                            <option value="CUSTOM">CUSTOM</option>
                        </select>
                    </label>

                    { showRepUntil && (
                        <label className="create-event__label" >
                            <span>repeat until</span>
                            <input
                                className="create-event__input"
                                type="datetime-local"
                                min = {value.eventStart|| value.eventEnd || minStart}
                                value={value.repUntil}
                                onChange={(e) => updateField("repUntil", e.target.value)}
                            />
                        </label>
                    )}
                </fieldset>

                <button className="create-event__submit" type="submit">
                    {submitText}
                </button>
            </form>
            {bEditMode && openEditScopeModal && (
                <EditScopeModal
                    bOpen={openEditScopeModal}
                    onCancel={() => setOpenEditScopeModal(false)}
                    onConfirm={() => submit(value, editScope)}
                    onConfirmTitle={"Update"}
                    onConfirmMsg={"Updating may cause overlaps with other events!!!"}
                    partOfSeries={partOfSeries}
                    editScope={editScope}
                    setEditScope={setEditScope}
                />
            )}

        </main>
    );
}