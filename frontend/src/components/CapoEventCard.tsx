import {Link, useLocation, useNavigate} from "react-router-dom";
import type {CapoEventType, DeleteScope} from "../types/CapoEvent.ts";
import "../styles/CapoEventCard.css"
import "../index.css"
import {deleteCapoEvent} from "../utility/AxiosUtilities.ts";
import {useState} from "react";
import DeleteOptionsModal from "./modals/DeleteOptionsModal.tsx";

type EventCardProps = {
    userId: string | undefined | null
    capoEvent: CapoEventType
    fetchEvents: () => Promise<void>
}

export default function CapoEventCard(props: Readonly<EventCardProps>) {

    const [deleteOption, setDeleteOption] = useState(false);
    const [deleteScope, setDeleteScope] = useState<DeleteScope>("ONLY_THIS");

    const location = useLocation();
    const nav = useNavigate();

    const eventIsValid = props.capoEvent !== undefined && props.capoEvent !== null;
    const isCreatedByUser = eventIsValid && props.userId === props.capoEvent.creatorId;

    function handleDelete() {

        if (props.capoEvent === null) {
            console.log("capoEvent === null or undefined, cannot proceed to delete event");
            return;
        }

        if (props.capoEvent.id === null || props.capoEvent.id === undefined){
            console.log("eventId === null or undefined, cannot proceed to delete event");
            return;
        }

        if (props.userId === null || props.userId === undefined){
            console.log("userId === null or undefined, cannot proceed to delete event");
            return;
        }

        deleteCapoEvent(props.userId, props.capoEvent.id, deleteScope, props.fetchEvents, nav, location.pathname)
            .catch((error) => {console.log("could not delete capoEvent through CapoEventCard: " + error.toString())});
    }

    function handleEdit() {

        const id:string = props.capoEvent.id;

        if (id === null || id === undefined){
            console.log("eventId === null or undefined, cannot move on to edit page");
            return;
        }

        nav("/edit/" + id);
    }

    const localDateTime = props.capoEvent.eventStart;
    const [date, timeWithRest] = localDateTime.split("T");
    const time = timeWithRest.slice(0, 5);

    return (
        <div>
        <Link className="card_link" to={`/capoevent/${props.capoEvent.id}`}>
            <div className="event_card" style={{backgroundImage: `url(${props.capoEvent.thumbnail})`}}>
                <div className="event_info">
                    <h3>{props.capoEvent.eventTitle}</h3>
                    <p>{props.capoEvent.eventType} · {props.capoEvent.locationData.city} · {date} · {time} </p>
                    <p>{props.capoEvent.creatorName}</p>
                    <p>
                        <button type={"button"} hidden={!isCreatedByUser} disabled={!isCreatedByUser}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setDeleteOption(true);
                                }}>delete
                        </button>
                        {"   "}
                        <button type={"button"} hidden={!isCreatedByUser} disabled={!isCreatedByUser}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleEdit();
                                }}>edit
                        </button>
                    </p>
                </div>
            </div>
        </Link>
            <DeleteOptionsModal
                deleteScope={deleteScope}
                setScope={setDeleteScope}
                open={deleteOption}
                onConfirm={async () => {
                    setDeleteOption(false);
                    handleDelete();
                }}
                onCancel={() => setDeleteOption(false)}
            />
        </div>
    )
}