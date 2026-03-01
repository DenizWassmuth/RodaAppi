import axios from "axios";
import type {CapoEventType, EditScope, EventFormValue, EventRegDto, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import type { AppUserType } from "../../types/AppUser.ts";
import CapoEventForm from "../CapoEventForm.tsx";
import FrameModal from "./FrameModal.tsx";

type EditModalProps = {
    bOpen: boolean;
    user: AppUserType | null;
    event: CapoEventType;
    setCapoEvent: (capoEvent: CapoEventType) => void;
    partOfSeries: PartOfSeriesDto;
    fetchEvents: () => Promise<void | string>;
    onClose: () => void;
};

export default function EditCapoEventModal({bOpen, user, event, setCapoEvent, partOfSeries, fetchEvents, onClose}:Readonly<EditModalProps>) {

    if(!bOpen || !user) {
        return null;
    }

    async function update(value: EventFormValue, scope: EditScope | null) {
        if (!user?.id) {
            throw new Error("Not logged in");
        }

        if (!event) {
            throw new Error("Missing eventId");
        }

        const dto: EventRegDto = {
            userId: String(user.id),
            ...value,
        };

        await axios.put(`/api/capoevent/update/${user.id}/${event.id}`, dto, {params: { editScope: scope },})
            .then(response => {console.log(response.data); setCapoEvent(response.data); })
            .catch(error => {
                console.log("could not update event: ", error);
                console.log(error)})
            .finally(() => {fetchEvents(); onClose()});
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
        userName: "",
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
        <>
            {bOpen &&
                <FrameModal title={"Edit Event"} open={bOpen} onClose={onClose}>
                    <div>
                        {!event && <p style={{color: "white"}}>Loading...</p>}
                        {event && (
                            <CapoEventForm
                                submitText="Update"
                                initialValue={initialValue}
                                submit={update}
                                bEditMode={true}
                                partOfSeries={partOfSeries}
                                countries={[]}
                            />
                        )}
                    </div>
                </FrameModal>
            }
        </>
    );
}