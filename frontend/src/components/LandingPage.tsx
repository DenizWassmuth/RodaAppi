import CapoEventCard from "./CapoEventCard.tsx";
import type {CapoEventType} from "../types/CapoEvent.ts";
import "../styles/CapoEventCard.css"
import "../index.css"

type EventsProps = {
    events:CapoEventType[];
}

export default function LandingPage(props: Readonly<EventsProps>) {

    return (
        <div>
            <main className="page_layout">
                {/* <Filterbar filters={filters} setFilters={setFilters}/>*/}

                <div className="events_row">
                    {props.events.map(capoEvent => (<CapoEventCard key={capoEvent.id} capoEvent={capoEvent} />))}
                </div>
            </main>
        </div>
    )
}