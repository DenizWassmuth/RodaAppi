import type {CapoEventType} from "../types/CapoEvent.ts";
import "../styles/CapoEventCard.css"
import "../index.css"
import CapoEventCard from "./CapoEventCard.tsx";

type EventsProps = {
    events:CapoEventType[];
}

export default function WorkshopsPage(props: Readonly<EventsProps>) {

    return (
        <div>
            <main className="page_layout">
                {/* <Filterbar filters={filters} setFilters={setFilters}/>*/}

                <div className="events_row">
                    {
                        props.events
                            .filter(capoEvent => capoEvent.eventType.match("WORKSHOP"))
                            .map((event: CapoEventType) => (<CapoEventCard key={event.id} capoEvent={event} />))
                    }
                </div>
            </main>
        </div>
    )
}