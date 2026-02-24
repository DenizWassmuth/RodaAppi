import {Link} from "react-router-dom";
import type {CapoEventType} from "../types/CapoEvent.ts";
import "../styles/CapoEventCard.css"
import "../index.css"
import type {AppUserType} from "../types/AppUser.ts";

type EventCardProps = {
    user: AppUserType | undefined | null
    capoEvent: CapoEventType
    onHandleEdit: (event: CapoEventType) => void;
    onHandleDelete: (event: CapoEventType) => void;
}

export default function CapoEventCard(props: Readonly<EventCardProps>) {

    const userIsValid = props.user !== null && props.user !== undefined;
    const eventIsValid = props.capoEvent !== undefined && props.capoEvent !== null;
    const isCreatedByUser = userIsValid && eventIsValid && props.user?.id === props.capoEvent.creatorId;

    function handleDelete() {
        const id: string | undefined = props.capoEvent?.id;
        if (!id) {
            console.log("capoEvent === null or undefined, cannot open delete modal");
            return;
        }
        props.onHandleDelete(props.capoEvent); // open modal from parent
    }

    function handleEdit() {
        if (!props.capoEvent) {
            console.log("capoEvent === null or undefined, cannot open edit modal");
            return;
        }
        props.onHandleEdit(props.capoEvent); // open modal from parent
    }

    const localDateTime : string | undefined = props.capoEvent?.eventStart;
    let [date , timeWithRest] = "";
    if (localDateTime !== null && localDateTime !== undefined) {
        [date, timeWithRest] = localDateTime.split("T");
    }
    const time = timeWithRest.slice(0, 5);

    return (
        <div>
        <Link className="card_link" to={`/capoevent/${props.capoEvent?.id}`}>
            <div className="event_card" style={{backgroundImage: `url(${props.capoEvent?.thumbnail})`}}>
                <div className="event_info">
                    <h3>{props.capoEvent?.eventTitle}</h3>
                    <p>{props.capoEvent?.eventType} · {props.capoEvent?.locationData.city} · {date} · {time} </p>
                    <p>{props.capoEvent?.creatorName}</p>
                    <p>
                        <button type={"button"} hidden={!isCreatedByUser} disabled={!isCreatedByUser}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete();
                                }}>delete
                        </button>
                        {"   "}
                        <button type="button" hidden={!isCreatedByUser} disabled={!isCreatedByUser} onClick={(e) => {
                                e.preventDefault();
                                handleEdit();
                            }}>edit
                        </button>
                    </p>
                </div>
            </div>
        </Link>
        </div>
    )
}