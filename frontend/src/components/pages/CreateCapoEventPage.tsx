import axios from "axios";
import CapoEventForm from "../CapoEventForm.tsx";

import type { AppUserType } from "../../types/AppUser.ts";
import type {EventFormValue, EventRegDto} from "../../types/CapoEvent.ts";
import {useNavigate} from "react-router-dom";
import CreateAndEditModal from "../modals/Create&EditModal.tsx";
import {useState} from "react";

type Props = {
    user: AppUserType;
    fetchEvents: () => Promise<void | string>;
    onClosePath:string;

};

export default function CreateCapoEventPage({user, fetchEvents, onClosePath}:Readonly<Props>) {
    const empty: EventFormValue = {
        userName:user?.username,
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
       if (!user?.id){
           throw new Error("Not logged in");
       }

        const dto: EventRegDto = {
            userId: String(user?.id),
            ...value,
        };

        setOpenFormModal(false);

        await axios.post("/api/capoevent", dto)
            .then(() => fetchEvents()
                .then(() => nav("/loggedin")));
    }

    function onClose(){
        setOpenFormModal(false);
        nav(onClosePath)
    }

    const isLoggedIn = user !== null && user !== undefined;

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
                            submit={submit}
                            bEditMode={false}
                            partOfSeries={null}
                        />
                    </div>
                </CreateAndEditModal>)
            }
        </>
    );
}