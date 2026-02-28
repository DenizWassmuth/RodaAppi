import {type FormEvent, useEffect, useMemo, useState} from "react";

import "../styles/CapoEventForm.css";
import type {
    CapoEventEnumType,
    EditScope,
    EventFormValue,
    PartOfSeriesDto,
    RepetitionRhythmEnumType
} from "../types/CapoEvent.ts";
import EditScopeModal from "./modals/EditScopeModal.tsx";
import type {CityData, CountryData, StateData} from "../types/GeoData.ts";
import {fetchCities, fetchStates} from "../utility/AxiosUtilities.ts";


type EventFormProps = {
    submitText: string;
    initialValue: EventFormValue;
    submit: (value: EventFormValue, scope:EditScope | null) => Promise<void>;
    bEditMode: boolean;
    partOfSeries: PartOfSeriesDto
    countries: CountryData[]
};

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

export default function CapoEventForm({initialValue, submitText, submit, bEditMode, partOfSeries, countries}: Readonly<EventFormProps>) {

    const [value, setValue] = useState<EventFormValue>(initialValue);
    const [error, setError] = useState<string | null>(null);

    const [editScope, setEditScope] = useState<EditScope>("ONLY_THIS");
    const [openEditScopeModal, setOpenEditScopeModal] = useState<boolean>(false);

    const [selectedCountryIso, setSelectedCountryIso] = useState<string | null>(null);

    const [states, setStates] = useState<StateData[]>([]);
    const [selectedStateIso, setSelectedStateIso] = useState<string | null>(null);

    const [cities, setCities] = useState<CityData[]>([]);

    const minStart = useMemo(() => nowAsDateTimeLocal(), []); // Compute once on mount.
    const showRepUntil = value.repRhythm !== "ONCE" && !bEditMode;

    function updateField<K extends keyof EventFormValue>(key: K, v: EventFormValue[K]) {
        setValue((prev) => ({...prev, [key]: v}));
    }

    function updateLocationField<K extends keyof EventFormValue["locationData"]>(key: K, v: EventFormValue["locationData"][K]){

        setValue((prev) => ({
            ...prev,
            locationData: {...prev.locationData, [key]: v},
        }));

        if (bEditMode) {
            return;
        }

        if (key === "country") {
            const countryName = String(v);
            console.log("country:", v);

            const countryIso = countries?.find((c) => c.name === countryName)?.isoCode ?? "";
            setSelectedCountryIso(countryIso);
            console.log("country code:", countryIso);

            setSelectedStateIso(null);
            setStates([]);
            setValue((prev) => ({
                ...prev,
                locationData: {...prev.locationData, ["state"]: ""},
            }));

            setCities([])
            setValue((prev) => ({
                ...prev,
                locationData: {...prev.locationData, ["city"]: ""},
            }));
        }

        if(key === "state") {
            const stateName = String(v);
            console.log("state:", stateName);

            const stateIso = states?.find((c) => c.name === stateName)?.isoCode ?? "";
            setSelectedStateIso(stateIso);
            console.log("state code:", stateIso);

            setCities([])
            setValue((prev) => ({
                ...prev,
                locationData: {...prev.locationData, ["city"]: ""},
            }));
        }

        if (key === "city") {
            const cityName = String(v);
            console.log("city: ", cityName);
        }
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

        setSelectedCountryIso(null);
        setSelectedStateIso(null);
        setStates([]);
    }

    useEffect(() => {
        if (!selectedCountryIso) {
            return;
        }

        console.log("fetching states");

    fetchStates(setStates, selectedCountryIso)
        .then();

    },[selectedCountryIso]);

    useEffect(() => {
        if (!selectedCountryIso || !selectedStateIso  ) {
            return;
        }

        fetchCities(setCities, selectedCountryIso, selectedStateIso)
            .then();

    },[selectedCountryIso, selectedStateIso]);


    return (
        <main className="create-event">
            <h1 className="create-event__title">{submitText} Capoeira Event</h1>
            <form className="create-event__form" onSubmit={handleSubmit}>
                <fieldset className="create-event__fieldset">
                    <legend className="create-event__legend">Basic</legend>

                    {error && <div className="create-event__alert create-event__alert--error">{error}</div>}

                    <label className="create-event__label">
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
                        <input
                            className="create-event__input"
                            value={value.eventTitle}
                            onChange={(e) => updateField("eventTitle", e.target.value)}
                            placeholder="title e.g. Weekly Roda"
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        <textarea
                            className="create-event__textarea"
                            value={value.eventDescription}
                            onChange={(e) => updateField("eventDescription", e.target.value)}
                            placeholder="What is this event about?"
                            rows={4}
                        />
                    </label>

                    <label className="create-event__label">
                        <input
                            className="create-event__input"
                            value={value.thumbnail}
                            onChange={(e) => updateField("thumbnail", e.target.value)}
                            placeholder="upload image"
                        />
                    </label>
                </fieldset>

                <fieldset className="create-event__fieldset">
                    <legend className="create-event__legend">Location</legend>
                    <label className="create-event__label">
                        <select
                            className="create-event__input"
                            value={value.locationData.country}
                            onChange={(e) => updateLocationField("country", e.target.value)}
                            disabled={bEditMode || (!bEditMode && countries.length <= 0)}
                            required={true}
                        >
                            <option value="" disabled>
                                select a country
                            </option>

                            {countries &&
                                countries.map((c) => (
                                    <option key={c.isoCode} value={c.name} >
                                        {c.name}
                                    </option>))}
                        </select>
                    </label>

                    <label className="create-event__label">
                        <select
                            className="create-event__input"
                            value={value.locationData.state}
                            onChange={(e) => updateLocationField("state", e.target.value)}
                            disabled={bEditMode || (!bEditMode && states.length <= 0)}
                            required={true}
                        >
                            <option value="" disabled>
                                select a state
                            </option>

                            {states &&
                                states.map((c) => (
                                    <option key={c.isoCode} value={c.name} >
                                        {c.name}
                                    </option>))}
                        </select>
                    </label>

                    <label className="create-event__label">
                        <select
                            className="create-event__input"
                            value={value.locationData.city}
                            onChange={(e) => updateLocationField("city", e.target.value)}
                            disabled={bEditMode || (!bEditMode && cities.length <= 0)}
                            required={true}
                        >
                            <option value="" disabled>
                                select a city
                            </option>

                            {cities &&
                                cities.map((c) => (
                                    <option key={c.name} value={c.name} >
                                        {c.name}
                                    </option>))}
                        </select>
                    </label>

                    <label className="create-event__label">
                        <input
                            className="create-event__input"
                            value={value.locationData.street}
                            onChange={(e) => updateLocationField("street", e.target.value)}
                            placeholder="enter the name of the street"
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        <input
                            className="create-event__input"
                            value={value.locationData.streetNumber}
                            onChange={(e) => updateLocationField("streetNumber", e.target.value)}
                            placeholder="enter the street number"
                            required={true}
                        />
                    </label>

                    <label className="create-event__label">
                        <input
                            className="create-event__input"
                            value={value.locationData.specifics}
                            onChange={(e) => updateLocationField("specifics", e.target.value)}
                            placeholder="enter specifics, e.g. 2nd floor, ring bell"
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