import axios from "axios";
import type {CapoEventType, EditScope, EventFormValue, EventRegDto, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import EventForm from "../EventForm.tsx";
import FrameModal from "./FrameModal.tsx";
import {useAuth} from "../../context/AuthContext.ts";
import {AnimatePresence} from "framer-motion";
import type {CountryData} from "../../types/GeoData.ts";
import {useNavigate} from "react-router-dom";
import {useEvents} from "../../context/EventContext.ts";

type EventModalProps = {
    bOpen: boolean;
    event?: CapoEventType | null;
    setCapoEvent?: (capoEvent: CapoEventType) => void;
    partOfSeries?: PartOfSeriesDto | null;
    fetchEvents: () => Promise<void | string>;
    onClose: () => void;
    countries: CountryData[];
};

export default function EventModal({bOpen, event, setCapoEvent, partOfSeries, fetchEvents, onClose, countries}: Readonly<EventModalProps>) {
    const { user } = useAuth();
    const { refreshEvents } = useEvents();
    const nav = useNavigate();

    const isEditMode = !!event;

    async function handlePost(dto: EventRegDto) {
        await axios.post("/api/capoevent", dto)
            .then(() => refreshEvents()
                .then(() => {
                    onClose();
                    nav("/loggedin");
                })
            )
            .catch(error => {
                console.error("Could not create event: ", error);
            });
    }

    async function handlePut(dto: EventRegDto, scope: EditScope | null) {
        if (!event) return;
        await axios.put(`/api/capoevent/update/${user?.id}/${event.id}`, dto, {params: { editScope: scope },})
            .then(response => {
                if (setCapoEvent) {
                    setCapoEvent(response.data);
                }
            })
            .catch(error => {
                console.error("Could not update event: ", error);
            })
            .finally(() => {
                fetchEvents();
                onClose();
            });
    }

    async function submit(value: EventFormValue, scope: EditScope | null) {
        if (!user?.id) {
            throw new Error("Not logged in");
        }

        const dto: EventRegDto = {
            userId: String(user.id),
            ...value,
        };

        if (isEditMode) {
            await handlePut(dto, scope);
        } else {
            await handlePost(dto);
        }
    }

    const initialValue: EventFormValue = event ? {
        userName: event.creatorName,
        eventTitle: event.eventTitle,
        eventDescription: event.eventDescription,
        thumbnail: event.thumbnail,
        locationData: event.locationData,
        eventStart: event.eventStart,
        eventEnd: event.eventEnd,
        eventType: event.eventType,
        repRhythm: event.repRhythm,
        repUntil: "",
    } : {
        userName: user?.username ?? "",
        eventTitle: "",
        eventDescription: "",
        thumbnail: "",
        locationData: {
            country: "",
            state: "",
            city: "",
            street: "",
            streetNumber: "",
            specifics:"" },
        eventStart: "",
        eventEnd: "",
        eventType: "RODA",
        repRhythm: "ONCE",
        repUntil: "",
    };

    return (
        <AnimatePresence>
            {user && bOpen && (
                <FrameModal title={isEditMode ? "Edit Event" : "Create Event"} open={bOpen} onClose={onClose}>
                    <div>
                        <EventForm
                            submitText={isEditMode ? "Update" : "Create"}
                            initialValue={initialValue}
                            submit={submit}
                            bEditMode={isEditMode}
                            partOfSeries={partOfSeries ?? null}
                            countries={countries}
                        />
                    </div>
                </FrameModal>
            )}
        </AnimatePresence>
    );
}