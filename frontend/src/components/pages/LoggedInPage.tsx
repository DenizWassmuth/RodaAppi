import CapoEventCard from "../CapoEventCard.tsx";
import "../../styles/CapoEventCard.css"
import "../../index.css"
import type {PageProps} from "../../types/PageProps.ts";


export default function LoggedInPage(props:Readonly<PageProps>) {

    const filteredEvents = props.user ?
        props.events.filter((capoEvent) => capoEvent.creatorId === props.user?.id) : [];

    props.setCurrentPath(props.pathToSet);

    return (
        <div>
            <main className="page_layout">
                <div className="events_row">
                    {filteredEvents.length === 0 ?
                        (<p>No events found</p>) : (filteredEvents.map((filteredEvent) => <CapoEventCard
                                key={filteredEvent.id}
                                capoEvent={filteredEvent}
                                userId={props.user?.id}
                                fetchEvents={props.fetchEvents}/>)
                        )
                    }
                </div>
            </main>
        </div>
    )
}