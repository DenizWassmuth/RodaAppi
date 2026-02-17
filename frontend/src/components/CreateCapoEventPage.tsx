import axios from "axios";
import CapoEventForm from "../components/CapoEventFormular";

import type { AppUserType } from "../types/AppUser";
import type {EventFormValue, EventRegDto} from "../types/CapoEvent.ts";
import {useNavigate} from "react-router-dom";

type CreateEventProps = {
    user: AppUserType;
    fetchEvents: () => Promise<void>;
};

export default function CreateCapoEventPage(props:Readonly<CreateEventProps>) {
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
    };

    const nav = useNavigate();

    async function submit(value: EventFormValue) {
        if (props?.user || props?.user?.id) throw new Error("Not logged in");

        const dto: EventRegDto = {
            userId: String(props?.user?.id),
            ...value,
        };

        await axios.post("/api/capoevent", dto)
            .then(()=> props.fetchEvents()
                .then(() => nav("/loggedin")));
    }

    const isLoggedIn = props.user !== null && props.user !== undefined;

    return (
        <>
            {!isLoggedIn && (
                <div className="create-event__alert create-event__alert--error">
                    You are not logged in. Please log in to create events.
                </div>
            )}

            {isLoggedIn && (
                <CapoEventForm
                    title="Create Event"
                    submitText="Create"
                    initialValue={empty}
                    onSubmit={submit}
                />)}
        </>
    );
}