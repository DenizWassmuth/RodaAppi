import { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

import type {CapoEventType, EventFormValue, EventRegDto} from "../types/CapoEvent";
import type { AppUserType } from "../types/AppUser";
import CapoEventForm from "./CapoEventFormular.tsx";

type Props = {
    user: AppUserType;
    fetchEvents: () => Promise<void>;

};

export default function EditCapoEventPage(props:Readonly<Props>) {
    const { id } = useParams();
    const [event, setEvent] = useState<CapoEventType | null>(null);

    const nav = useNavigate();

    useEffect(() => {
        if (!id) return;
        axios.get(`/api/capoevent/${id}`)
            .then((res) => setEvent(res.data));
    }, [id]);

    if (!id) return <p style={{ color: "white" }}>Missing event id</p>;
    if (!event) return <p style={{ color: "white" }}>Loading...</p>;

    const initial: EventFormValue = {
        userName:event.creatorName,
        eventTitle: event.eventTitle,
        eventDescription: event.eventDescription,
        thumbnail: event.thumbnail,
        locationData: event.locationData,
        eventStart: event.eventStart,
        eventEnd: event.eventEnd,
        eventType: event.eventType,
        repRhythm: event.repRhythm,
    };

    async function submit(value: EventFormValue) {
        if (props?.user || props?.user?.id) throw new Error("Not logged in");

        const dto: EventRegDto = {
            userId: String(props?.user?.id),
            ...value,
        };

        await axios.put(`/api/capoevent/update/${props?.user?.id}/${id}`, dto)
            .then(() => props.fetchEvents())
            .then(() => nav("/loggedin"));
    }

    return (
        <CapoEventForm
            submitText="Update"
            initialValue={initial}
            onSubmit={submit}
        />
    );
}