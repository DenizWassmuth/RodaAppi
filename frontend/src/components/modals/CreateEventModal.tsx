import axios from "axios";
import EventForm from "../EventForm.tsx";

import type {EventFormValue, EventRegDto} from "../../types/CapoEvent.ts";
import {useNavigate} from "react-router-dom";
import FrameModal from "./FrameModal.tsx";
import type {CountryData} from "../../types/GeoData.ts";
import {useAuth} from "../../context/AuthContext.ts";
import {useEvents} from "../../context/EventContext.ts";

type Props = {
    bOpenForm: boolean;
    onClose:() => void;
    countries:CountryData[]
};

export default function CreateEventModal({bOpenForm, onClose, countries}:Readonly<Props>) {
    const { user } = useAuth();
    const { refreshEvents } = useEvents();
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

    const nav = useNavigate();

    const isLoggedIn = !!user;

    async function submit(value: EventFormValue) {
        if (!isLoggedIn) {
            throw new Error("Not logged in");
        }

       if (!user?.id){
           throw new Error("Not logged in");
       }

        const dto: EventRegDto = {
            userId: String(user?.id),
            ...value,
        };

        await axios.post("/api/capoevent", dto)
            .then(() => refreshEvents()
                .then(() => {
                    onClose();
                    nav("/loggedin");
                })
            );
    }

    return (
        <>
            {!isLoggedIn && (
                <div className="create-event__alert create-event__alert--error">
                    You are not logged in. Please log in to create events.
                </div>
            )}

            {isLoggedIn && bOpenForm && (
                <FrameModal title={""} open={bOpenForm} onClose={onClose}>
                    <div>
                        <EventForm
                            submitText="Create"
                            initialValue={empty}
                            submit={submit}
                            bEditMode={false}
                            partOfSeries={null}
                            countries={countries}
                        />
                    </div>
                </FrameModal>)
            }
        </>
    );
}