import {Link} from "react-router-dom";
import type {CapoEventType} from "../types/CapoEvent.ts";
import "../styles/CapoEventCard.css"
import "../index.css"
import type {AppUserType} from "../types/AppUser.ts";
import {bookmarkEvents} from "../utility/AxiosUtilities.ts";

type EventCardProps = {
    user: AppUserType | undefined | null
    capoEvent: CapoEventType
    onHandleEdit: (event: CapoEventType) => void;
    onHandleDelete: (event: CapoEventType) => void;
    bookmarks:string[] | null;
    fetchEvents: () => Promise<void | string>;
}

export default function CapoEventCard({ user, capoEvent, bookmarks, onHandleEdit, onHandleDelete, fetchEvents}: Readonly<EventCardProps>) {

    const bUserIsValid = user !== null && user !== undefined;
    const bEventIsValid = capoEvent !== undefined && capoEvent !== null;
    const bShowButtons = bUserIsValid && bEventIsValid;
    const bIsCreatedByUser = bShowButtons && user?.id === capoEvent.creatorId;
    const bBookmarksNotNull =  bookmarks !== null;
    const bIsBookmarkedByUser = bShowButtons && bBookmarksNotNull && bookmarks.includes(capoEvent?.id)

    function handleDelete() {
        if (!capoEvent) {
            console.log("capoEvent === null or undefined, cannot open delete modal");
            return;
        }
        onHandleDelete(capoEvent); // open modal from parent
    }

    function handleEdit() {
        if (!capoEvent) {
            console.log("capoEvent === null or undefined, cannot open edit modal");
            return;
        }
        onHandleEdit(capoEvent); // open modal from parent
    }

  function handleBookmarking() {

        if (!capoEvent) {
            console.log("capoEvent === null or undefined, cannot handle bookmarks");
            return;
        }

        bookmarkEvents(user?.id, capoEvent?.id, bIsBookmarkedByUser)
            .then(() => fetchEvents());
    }

    const localDateTime : string | undefined = capoEvent?.eventStart;
    let [date , timeWithRest] = "";
    if (localDateTime !== null && localDateTime !== undefined) {
        [date, timeWithRest] = localDateTime.split("T");
    }
    const time = timeWithRest.slice(0, 5);

    return (
        <div>
            <Link className="card_link" to={`/capoevent/${capoEvent?.id}`}>
                <div className="event_card" style={{backgroundImage: `url(${capoEvent?.thumbnail})`}}>
                    <div className="event_info">
                        <h3>{capoEvent?.eventTitle}</h3>
                        <p>{capoEvent?.eventType} · {capoEvent?.locationData.city} · {date} · {time} </p>
                        <p>{capoEvent?.creatorName}</p>
                        <p>
                            <button type={"button"} hidden={!bIsCreatedByUser} disabled={!bIsCreatedByUser}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete();
                                    }}>delete
                            </button>
                            {"   "}
                            <button type="button" hidden={!bIsCreatedByUser} disabled={!bIsCreatedByUser}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleEdit();
                                    }}>edit
                            </button>
                            {"   "}
                            <button type="button" hidden={!bShowButtons} disabled={!bShowButtons}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleBookmarking()
                                    }}>{bIsBookmarkedByUser ? "★" : "☆"}
                            </button>
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    )
}