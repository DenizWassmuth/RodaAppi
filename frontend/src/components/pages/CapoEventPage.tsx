import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {CapoEventType, DeleteScope} from "../../types/CapoEvent.ts";
import axios from "axios";
import "../../styles/CapoEventPage.css"
import type {AppUserType} from "../../types/AppUser.ts";
import {deleteCapoEvent} from "../../utility/AxiosUtilities.ts";
import DeleteOptionsModal from "../modals/DeleteOptionsModal.tsx";

type EventPageProps = {
    appUser: AppUserType
    fetchEvents:() => Promise<void>
}

export default function CapoEventPage(props:Readonly<EventPageProps>) {

    const { id } = useParams();
    const nav = useNavigate();
    const [capoEvent, setCapoEvent] = useState<CapoEventType>();

    const [deleteOption, setDeleteOption] = useState(false);
    const [deleteScope, setDeleteScope] = useState<DeleteScope>("ONLY_THIS");

    const isLoggedIn = props.appUser !== null && props.appUser !== undefined;
    const eventIsValid = capoEvent !== undefined && capoEvent !== null;
    const eventIsCreatedByUser = isLoggedIn && eventIsValid && props.appUser.id === capoEvent?.creatorId;

    useEffect(() => {

        axios.get("/api/capoevent/" + id)
            .then((r => setCapoEvent(r.data)));

    }, [id]);

    async function deleteEvent(user:AppUserType | undefined | null, eventId:string | undefined) {
        if (user === null || user === undefined) {
            console.log("user === null or undefined, cannot proceed to delete event");
            return;
        }

        if (eventId === null || eventId === undefined){
            console.log("eventId === null or undefined, cannot proceed to delete event");
            return;
        }

        console.log("awaiting axios response for deleteEvent with id: ", eventId + " and scope: ", deleteScope);

        // TODO pass deleteScope
       await deleteCapoEvent(user.id, eventId, props.fetchEvents, nav, "/");
    }

    function editEvent(id:string | undefined)
    {
        if (id === null || id === undefined){
            console.log("eventId === null or undefined, cannot move on to edit page");
            return;
        }

        nav("/edit/" + id);
    }

    return (
        <article >
            <div className="details-left">
                <div className="details-banner">
                    <img src={capoEvent?.thumbnail} alt="Thumbnail"/>
                    <h1>{capoEvent?.eventTitle}</h1>
                </div>
                <div>
                    <div className="details">
                        <p><b>{capoEvent?.eventType}</b></p>
                        <p><b>{capoEvent?.eventTitle}</b></p>
                        <p><b>{capoEvent?.eventDescription}</b></p>
                        <p><b>{capoEvent?.locationData.country}</b></p>
                        <p><b>{capoEvent?.locationData.state}</b></p>
                        <p><b>{capoEvent?.locationData.city}</b></p>
                        <p><b>{capoEvent?.locationData.street + " " + capoEvent?.locationData.streetNumber}  </b></p>
                        <p><b>{capoEvent?.locationData.specifics}</b></p>
                        <p><b>{capoEvent?.eventStart}</b></p>
                        <p><b>{capoEvent?.eventEnd}</b></p>

                       <p>
                           <button type={"button"} disabled={!eventIsCreatedByUser} hidden={!eventIsCreatedByUser}
                                onClick={() => setDeleteOption(true)}>delete
                           </button> {" "}
                           <button type={"button"} disabled={!eventIsCreatedByUser} hidden={!eventIsCreatedByUser}
                                   onClick={() => editEvent(capoEvent?.id)}>edit
                           </button>
                       </p>
                        <DeleteOptionsModal
                            deleteScope={deleteScope}
                            setScope={setDeleteScope}
                            open={deleteOption}
                            onConfirm={async () => {
                                setDeleteOption(false);
                                await deleteEvent(props.appUser, id);
                            }}
                            onCancel={() => setDeleteOption(false)}
                        />
                    </div>
                </div>
            </div>
        </article>
    );
}