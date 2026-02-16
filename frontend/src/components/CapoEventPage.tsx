import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {CapoEventType} from "../types/CapoEvent.ts";
import axios from "axios";
import "../styles/CapoEventPage.css"
import type {AppUserType} from "../types/AppUser.ts";
import {deleteCapoEvent} from "../utility/AxiosUtilities.ts";

type EventPageProps = {
    appUser: AppUserType
    fetchEvents:() => Promise<void>
}

export default function CapoEventPage(props:Readonly<EventPageProps>) {

    const nav = useNavigate();
    const [capoEvent, setCapoEvent] = useState<CapoEventType>();

    const isLoggedIn = props.appUser !== null && props.appUser !== undefined;
    const eventIsValid = capoEvent !== undefined && capoEvent !== null;
    const eventIsCreatedByUser = isLoggedIn && eventIsValid && props.appUser.id === capoEvent?.creatorId;

    const { id } = useParams();

    useEffect(() => {
        if (id === null) return;
        axios.get("/api/capoevent/" + id)
            .then((r => setCapoEvent(r.data)));

    }, [id]);

    async function deleteEvent(user:AppUserType | undefined | null, eventId:string | undefined) {
        if (user === null || user === undefined) {
            console.log("user === null or undefined");
            return;
        }
        if (eventId === null || eventId === undefined){
            console.log("eventId === null or undefined");
            return;
        }

        console.log("awaiting axios response for deleteEvent with eventId: ", eventId);

        //await axios.delete(`/api/capoevent/${user.id}/${eventId}`)
        //    .then(() => props.fetchEvents()
        //        .then(() => nav("/"))
        //        .catch(error => console.log( error + ", axios responded with error for deleteEvent with eventId : ", eventId)));

       await deleteCapoEvent(user.id, eventId, props.fetchEvents, nav, "/");
    }

    return (
        <article className="details-layout">
            <div className="details-left">
                <div className="details-banner">
                    <img src={capoEvent?.thumbnail} alt="Thumbnail" />
                    <h1>{capoEvent?.eventTitle}</h1>
                </div>
                <div>
                    <div className="details">

                        {eventIsCreatedByUser && (
                            <>
                                <button type={"button"} onClick={() => deleteEvent(props.appUser, capoEvent?.id)}>delete</button>
                            </>)
                        }
                        {/* <p><b>Streamable:</b> {movie.streamable.length ? movie.streamable.join(", ") : "—"}</p>
                        <p><b>Release date:</b> {w.releaseDate}</p>
                        <p><b>Duration:</b> {w.duration}</p>
                        <p><b>Actors:</b> {w.actors.length ? w.actors.join(", ") : "—"}</p>
                        <p><b>Directors:</b> {w.directors.length ? w.directors.join(", ") : "—"}</p>
                        <p><b>Genres:</b> {w.genres.length ? w.genres.join(", ") : "—"}</p>
                        {w.episode > 0 && <p><b>Episode:</b> {w.episode}</p> }
                        <p><b>Age rating:</b> {w.ageRating}+</p>
                    </div>
                </div>
            </div>
            <div className="details-side">
                <div>
                    <h1>Other Movies</h1>
                    {Movies
                        .filter(m => m.id !== movie.id)
                        .map(m => (
                            <MovieCard key={m.id} movie={m} />
                        ))}*/}
                    </div>
                </div>
            </div>
        </article>
    );
}