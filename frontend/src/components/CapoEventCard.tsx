import {Link, useLocation, useNavigate} from "react-router-dom";
import type {CapoEventType} from "../types/CapoEvent.ts";
import "../styles/CapoEventCard.css"
import "../index.css"
import {deleteCapoEvent} from "../utility/AxiosUtilities.ts";

type EventCardProps = {
    capoEvent: CapoEventType
    userId: string | undefined | null
    fetchEvents: () => Promise<void>
}

export default function CapoEventCard(props: Readonly<EventCardProps>) {

    const location = useLocation();

    const nav = useNavigate();

    const eventIsValid = props.capoEvent !== undefined && props.capoEvent !== null;
    const isCreatedByUser = eventIsValid && props.userId === props.capoEvent.creatorId;

    function handleDelete() {

        deleteCapoEvent(props.userId, props.capoEvent.id, props.fetchEvents, nav, location.pathname)
            .catch((error) => {console.log("could not delete capoEvent through CapoEventCard: " + error.toString())});
    }

    return (
            <Link className="card_link" to={`/capoevent/${props.capoEvent.id}`}>
                <div className="event_card" style={{backgroundImage: `url(${props.capoEvent.thumbnail})`}}>
                    <div className="event_info">
                        <h3>{props.capoEvent.eventTitle}</h3>
                        <p>{props.capoEvent.eventType} · {props.capoEvent.locationData.city} · {props.capoEvent.eventStart}</p>
                        <p>{props.capoEvent.creatorName}</p>
                        {isCreatedByUser && (
                            <p>
                                <button type={"button"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete();
                                        }}>delete
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </Link>
    )
}