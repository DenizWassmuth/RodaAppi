import {Link} from "react-router-dom";
import type {CapoEventType} from "../types/CapoEvent.ts";
import "../styles/CapoEventCard.css"
import "../index.css"

type CardProps = {
    capoEvent: CapoEventType
}

export default function CapoEventCard(props:Readonly<CardProps>){
    return (
        <>
            <Link className="card_link" to={`/capoevent/${props.capoEvent.id}`}>
                <div className="event_card" style={{backgroundImage: `url(${props.capoEvent.thumbnail})`}}>
                    <div className="event_info">
                        <h3>{props.capoEvent.eventTitle}</h3>
                        <p>{props.capoEvent.eventType} · {props.capoEvent.locationData.city} · {props.capoEvent.eventStart}</p>
                        <p>{props.capoEvent.creatorName}</p>
                    </div>
                </div>
            </Link>
        </>
    )
}