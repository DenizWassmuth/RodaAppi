import axios from "axios";
import CapoEventForm from "../CapoEventForm.tsx";

import type { AppUserType } from "../../types/AppUser.ts";
import type {EventFormValue, EventRegDto} from "../../types/CapoEvent.ts";
import {useNavigate} from "react-router-dom";
import CreateAndEditModal from "../modals/Create&EditModal.tsx";
import {useState} from "react";

type Props = {
    user: AppUserType;
    fetchEvents: () => Promise<void>;
    onClosePath:string;

};

export default function CreateCapoEventPage(props:Readonly<Props>) {
    const empty: EventFormValue = {
        userName:props.user?.username,
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
        eventType: "RODA",
        repRhythm: "ONCE",
        repUntil: ""
    };

    const [openFormModal, setOpenFormModal] = useState(true);
    const nav = useNavigate();

    async function submit(value: EventFormValue) {
       if (!props.user?.id) throw new Error("Not logged in");

        const dto: EventRegDto = {
            userId: String(props.user.id),
            ...value,
        };

        setOpenFormModal(false);

        await axios.post("/api/capoevent", dto)
            .then(() => props.fetchEvents()
                .then(() => nav("/loggedin")));
    }

    function onClose(){
        setOpenFormModal(false);
        nav(props.onClosePath)
    }

    const isLoggedIn = props.user !== null && props.user !== undefined;

    if (!openFormModal) {
        return null;
    }

    return (
        <>
            {!isLoggedIn && (
                <div className="create-event__alert create-event__alert--error">
                    You are not logged in. Please log in to create events.
                </div>
            )}

            {isLoggedIn && openFormModal && (
                <CreateAndEditModal title={""} open={openFormModal} onClose={() => onClose()} >
                    <div>
                        <CapoEventForm
                            submitText="Create"
                            initialValue={empty}
                            onSubmit={submit}
                            bEditMode={false}
                        />
                    </div>
                </CreateAndEditModal>)
            }
        </>
    );
}