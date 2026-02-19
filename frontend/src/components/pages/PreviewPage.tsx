import CapoEventCard from "../CapoEventCard.tsx";
import "../../styles/CapoEventCard.css"
import "../../index.css"
import type {PageProps} from "../../types/PreviewPageProps.ts";
import type {CapoEventType} from "../../types/CapoEvent.ts";


export default function PreviewPage(props: Readonly<PageProps>) {

    return (
        <div>
            <main className="page_layout">
                <div className="events_row">
                    {
                        props.typeOfEvent.match("NONE") && props.events
                            .map(capoEvent => (
                                <CapoEventCard
                                    key={capoEvent.id}
                                    capoEvent={capoEvent}
                                    userId={props.user?.id}
                                    fetchEvents={props.fetchEvents}/>)
                            )
                    }

                    {
                        props.typeOfEvent.toString().length >= 0 && props.events
                            .filter(capoEvent => capoEvent.eventType.match(props.typeOfEvent))
                            .map((event: CapoEventType) => (
                                <CapoEventCard
                                    key={event.id}
                                    capoEvent={event}
                                    userId={props.user?.id}
                                    fetchEvents={props.fetchEvents}/>))
                    }
                </div>
            </main>
        </div>
    )
}