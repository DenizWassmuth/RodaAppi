import axios from "axios";
import type {CapoEventType, EditScope, EventFormValue, EventRegDto, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import type { AppUserType } from "../../types/AppUser.ts";
import CapoEventForm from "../CapoEventForm.tsx";
import CreateAndEditModal from "./Create&EditModal.tsx";

type EditModalProps = {
    bOpen: boolean;
    user: AppUserType | null;
    event: CapoEventType;
    partOfSeries: PartOfSeriesDto;
    fetchEvents: () => Promise<void | string>;
    onClose: () => void;
};

export default function EditCapoEventModal(props:Readonly<EditModalProps>) {

    async function update(value: EventFormValue, scope: EditScope | null) {
        if (!props.user?.id) {
            throw new Error("Not logged in");
        }

        if (!props.event) {
            throw new Error("Missing eventId");
        }

        const dto: EventRegDto = {
            userId: String(props.user.id),
            ...value,
        };

        await axios.put(`/api/capoevent/update/${props.user.id}/${props.event.id}`, dto, {params: { editScope: scope },})
            .then(response => {console.log(response.data)})
            .finally(() => {props.fetchEvents(); props.onClose()});
    }

    if(!props.bOpen){
        return null;
    }

    const initial: EventFormValue = props.event ? {
        userName: props.event.creatorName,
        eventTitle: props.event.eventTitle,
        eventDescription: props.event.eventDescription,
        thumbnail: props.event.thumbnail,
        locationData: props.event.locationData,
        eventStart: props.event.eventStart,
        eventEnd: props.event.eventEnd,
        eventType: props.event.eventType,
        repRhythm: props.event.repRhythm,
        repUntil: "",
    } : {
        userName: "",
        eventTitle: "",
        eventDescription: "",
        thumbnail: "",
        locationData: { country: "", state: "", city: "", street: "", streetNumber: "", specifics:"" },
        eventStart: "",
        eventEnd: "",
        eventType: "RODA",
        repRhythm: "ONCE",
        repUntil: "",
    };

    return (
        <>
            {props.bOpen &&
                <CreateAndEditModal
                    title={"Edit Event"}
                    open={props.bOpen}
                    onClose={props.onClose}
                >
                    <div>
                        {!props.event && <p style={{color: "white"}}>Loading...</p>}

                        {props.event && (
                            <CapoEventForm
                                submitText="Update"
                                initialValue={initial}
                                submit={update}
                                bEditMode={true}
                                partOfSeries={props.partOfSeries}
                            />
                        )}
                    </div>
                </CreateAndEditModal>
            }
        </>
    );
}