import CapoEventCard from "./CapoEventCard.tsx";
import "../styles/CapoEventCard.css"
import "../index.css"
import type {PageProps} from "../types/PreviewPageProps.ts";


export default function LoggedInPage(props:Readonly<PageProps>) {

    const filteredEvents = props.userId
        ? props.events.filter((capoEvent) => capoEvent.creatorId === props.userId)
        : [];

    return (
        <div>
            <main className="page_layout">
                {/* <Filterbar filters={filters} setFilters={setFilters}/>*/}

                <div className="events_row">
                    {filteredEvents.length === 0 ?
                        (<p>No events found</p>)
                        :
                        (filteredEvents.map((filteredEvent) => <CapoEventCard key={filteredEvent.id} capoEvent={filteredEvent} userId={props.userId} fetchEvents={props.fetchEvents}/>))
                    }
                </div>
            </main>
        </div>
    )
}