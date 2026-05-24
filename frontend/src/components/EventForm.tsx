import { useEffect, useMemo, useState } from "react";
import { useForm} from "react-hook-form";
import "../styles/CapoEventForm.css";
import type {
    EditScope,
    EventFormValue,
    PartOfSeriesDto,
} from "../types/CapoEvent.ts";
import EditScopeModal from "./modals/EditScopeModal.tsx";
import FrameModal from "./modals/FrameModal.tsx";
import type { CityData, CountryData, StateData } from "../types/GeoData.ts";
import { fetchCities, fetchStates } from "../utility/AxiosUtilities.ts";
import { addOneHourToDateTimeInput, nowAsDateTimeLocal } from "../utility/Helpers.ts";

type EventFormProps = {
    submitText: string;
    initialValue: EventFormValue;
    submit: (value: EventFormValue, scope: EditScope | null) => Promise<void>;
    bEditMode: boolean;
    partOfSeries: PartOfSeriesDto;
    countries: CountryData[];
};

export default function EventForm({ initialValue, submitText, submit, bEditMode, partOfSeries, countries }: Readonly<EventFormProps>) {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<EventFormValue>({
        defaultValues: initialValue
    });

    const [editScope, setEditScope] = useState<EditScope>("ONLY_THIS");
    const [openEditScopeModal, setOpenEditScopeModal] = useState<boolean>(false);

    const [selectedCountryIso, setSelectedCountryIso] = useState<string | null>(null);
    const [states, setStates] = useState<StateData[]>([]);
    const [selectedStateIso, setSelectedStateIso] = useState<string | null>(null);
    const [cities, setCities] = useState<CityData[]>([]);

    const minStart = useMemo(() => nowAsDateTimeLocal(), []);
    
    // Watch fields for conditional logic
    const repRhythm = watch("repRhythm");
    const eventStart = watch("eventStart");
    const country = watch("locationData.country");
    const state = watch("locationData.state");

    const showRepUntil = repRhythm !== "ONCE" && !bEditMode;

    // Handle Country -> States dependency
    useEffect(() => {
        if (bEditMode || !country) return;
        const countryIso = countries?.find((c) => c.name === country)?.isoCode ?? "";
        setSelectedCountryIso(countryIso);
        setSelectedStateIso(null);
        setStates([]);
        setCities([]);
        setValue("locationData.state", "");
        setValue("locationData.city", "");
    }, [country, countries, bEditMode, setValue]);

    useEffect(() => {
        if (!selectedCountryIso) return;
        fetchStates(setStates, selectedCountryIso).then();
    }, [selectedCountryIso]);

    // Handle State -> Cities dependency
    useEffect(() => {
        if (bEditMode || !state) return;
        const stateIso = states?.find((s) => s.name === state)?.isoCode ?? "";
        setSelectedStateIso(stateIso);
        setCities([]);
        setValue("locationData.city", "");
    }, [state, states, bEditMode, setValue]);

    useEffect(() => {
        if (!selectedCountryIso || !selectedStateIso) return;
        fetchCities(setCities, selectedCountryIso, selectedStateIso).then();
    }, [selectedCountryIso, selectedStateIso]);

    // Update derived date fields
    useEffect(() => {
        if (eventStart && !bEditMode) {
            const end = addOneHourToDateTimeInput(eventStart) ?? "";
            setValue("eventEnd", end);
            setValue("repUntil", eventStart);
        }
    }, [eventStart, bEditMode, setValue]);

    const onFormSubmit = (data: EventFormValue) => {
        if (bEditMode) {
            setOpenEditScopeModal(true);
            return;
        }
        submit(data, null).catch((err: Error) => console.log("SUBMIT FAILED: " + err));
    };

    return (
        <main className="create-event">
            <h1 className="create-event__title">{submitText} Capoeira Event</h1>
            <form className="create-event__form" onSubmit={handleSubmit(onFormSubmit)}>
                <fieldset className="create-event__fieldset">
                    <legend className="create-event__legend">Basic</legend>
                    <label className="create-event__label">
                        <select
                            className="create-event__select"
                            {...register("eventType", { required: !bEditMode })}
                            disabled={bEditMode}
                        >
                            <option value="RODA">RODA</option>
                            <option value="WORKSHOP">WORKSHOP</option>
                        </select>
                    </label>
                    <label className="create-event__label">
                        <input
                            className={`create-event__input ${errors.eventTitle ? 'border-red-500' : ''}`}
                            {...register("eventTitle", { required: "Title is required" })}
                            placeholder="title e.g. Weekly Roda"
                        />
                        {errors.eventTitle && <span className="text-red-500 text-xs">{errors.eventTitle.message}</span>}
                    </label>

                    <label className="create-event__label">
                        <textarea
                            className="create-event__textarea"
                            {...register("eventDescription")}
                            placeholder="What is this event about?"
                            rows={4}
                        />
                    </label>
                    <label className="create-event__label">
                        <input
                            className="create-event__input"
                            {...register("thumbnail")}
                            placeholder="image URL"
                        />
                    </label>
                </fieldset>
                <fieldset className="create-event__fieldset">
                    <legend className="create-event__legend">Location</legend>
                    <label className="create-event__label">
                        <select
                            className="create-event__input"
                            {...register("locationData.country", { required: !bEditMode })}
                            disabled={bEditMode || (!bEditMode && countries.length <= 0)}
                        >
                            <option value="" disabled> select a country </option>
                            <option value=""> clear field </option>
                            {countries?.map((c) => (
                                <option key={c.isoCode} value={c.name}> {c.name} </option>
                            ))}
                        </select>
                    </label>

                    <label className="create-event__label">
                        <select
                            className="create-event__input"
                            {...register("locationData.state", { required: !bEditMode })}
                            disabled={bEditMode || (!bEditMode && states.length <= 0)}
                        >
                            <option value="" disabled> select a state </option>
                            <option value=""> clear field </option>
                            {states?.map((c) => (
                                <option key={c.isoCode} value={c.name}> {c.name} </option>
                            ))}
                        </select>
                    </label>

                    <label className="create-event__label">
                        <select
                            className="create-event__input"
                            {...register("locationData.city", { required: !bEditMode && cities.length > 0 })}
                            disabled={bEditMode || (!bEditMode && cities.length <= 0)}
                        >
                            <option value="" disabled> select a city </option>
                            <option value=""> clear field </option>
                            {cities?.map((c) => (
                                <option key={c.name} value={c.name}> {c.name} </option>
                            ))}
                        </select>
                    </label>

                    <label className="create-event__label">
                        <input
                            className="create-event__input"
                            {...register("locationData.street", { required: true })}
                            placeholder="street name"
                        />
                    </label>

                    <label className="create-event__label">
                        <input
                            className="create-event__input"
                            {...register("locationData.streetNumber", { required: true })}
                            placeholder="street number"
                        />
                    </label>

                    <label className="create-event__label">
                        <input
                            className="create-event__input"
                            {...register("locationData.specifics")}
                            placeholder="specifics, e.g. 2nd floor"
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
                            {...register("eventStart", { required: true })}
                        />
                    </label>

                    <label className="create-event__label">
                        <span>Event End</span>
                        <input
                            className="create-event__input"
                            type="datetime-local"
                            min={eventStart || minStart}
                            {...register("eventEnd")}
                        />
                    </label>

                    <label className="create-event__label">
                        <span>Repetition Rhythm</span>
                        <select
                            className="create-event__select"
                            {...register("repRhythm", { required: !bEditMode })}
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

                    {showRepUntil && (
                        <label className="create-event__label">
                            <span>repeat until</span>
                            <input
                                className="create-event__input"
                                type="datetime-local"
                                min={eventStart || minStart}
                                {...register("repUntil", { required: true })}
                            />
                        </label>
                    )}
                </fieldset>

                <button className="create-event__submit" type="submit">
                    {submitText}
                </button>
            </form>
            {bEditMode && openEditScopeModal && (
                <FrameModal title={"Update Scope"} open={openEditScopeModal} onClose={() => setOpenEditScopeModal(false)}>
                    <EditScopeModal
                        bOpen={openEditScopeModal}
                        onConfirm={() => submit(watch(), editScope)}
                        onConfirmTitle={"Update"}
                        onConfirmMsg={"Updating may cause overlaps with other events!!!"}
                        partOfSeries={partOfSeries}
                        editScope={editScope}
                        setEditScope={setEditScope}
                    />
                </FrameModal>
            )}
        </main>
    );
}