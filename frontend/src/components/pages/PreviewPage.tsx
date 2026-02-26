import CapoEventCard from "../CapoEventCard.tsx";
import "../../styles/CapoEventCard.css"
import "../../index.css"
import {useEffect, useState} from "react";
import EditCapoEventModal from "../modals/EditCapoEventModal.tsx";
import type {AppUserType} from "../../types/AppUser.ts";
import type {CapoEventType, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import {DeleteCapoEventModal} from "../modals/DeleteCapoEventModal.tsx";
import {checkIfPartOfSeries} from "../../utility/AxiosUtilities.ts";

type PageProps = {
    user:AppUserType | null | undefined;
    bIsLoginArea: boolean;
    events:CapoEventType[];
    fetchEvents: () => Promise<void | string>;
    bookmarks:string[] | null;
}

export default function PreviewPage({user, bIsLoginArea, events, fetchEvents, bookmarks}: Readonly<PageProps>) {

    const [capoEvent, setCapoEvent] = useState<CapoEventType>(null);
    const [bOpenEdit, setOpenEdit] = useState(false);
    const [bOpenDelete, setOpenDelete] = useState(false);
    const [partOfSeries, setPartOfSeries] = useState<PartOfSeriesDto>(null);

    useEffect(() => {
        if (!capoEvent) {
            return;
        }

        checkIfPartOfSeries(capoEvent, setPartOfSeries)
            .then();

    }, [capoEvent])

    function openEditModal(event: CapoEventType) {
        setCapoEvent(event);
        setOpenEdit(true);
    }

    function closeEditModal() {
        setOpenEdit(false);
        setCapoEvent(null);
        setPartOfSeries(null);
    }

    function openDeleteModal(event: CapoEventType) {
        setCapoEvent(event);
        setOpenDelete(true);
    }

    function closeDeleteModal() {
        setOpenDelete(false);
        setCapoEvent(null);
        setPartOfSeries(null);
    }

    let eventsToMap = events;
    if (user && bIsLoginArea){
       eventsToMap = events
           .filter((capoEvent) => capoEvent?.creatorId === user?.id);
    }

    return (
        <div>
            <main className="page_layout">
                <div className="events_row">
                    {
                        eventsToMap
                            .map(capoEvent => (
                                    <CapoEventCard
                                        key={capoEvent?.id}
                                        capoEvent={capoEvent}
                                        user={user}
                                        onHandleEdit={openEditModal}
                                        onHandleDelete={openDeleteModal}
                                        bookmarks={bookmarks}
                                        fetchEvents={fetchEvents}
                                    />
                                )
                            )
                    }
                </div>
            </main>

            { (
                <>
                    {user && bOpenEdit && (
                        <EditCapoEventModal
                            bOpen={bOpenEdit}
                            event={capoEvent}
                            partOfSeries={partOfSeries}
                            user={user}
                            fetchEvents={fetchEvents}
                            onClose={closeEditModal}
                        />
                    )}
                    {user && bOpenDelete && (
                        <DeleteCapoEventModal
                            bOpen={bOpenDelete}
                            eventId={capoEvent?.id}
                            partOfSeries={partOfSeries}
                            user={user}
                            fetchEvents={fetchEvents}
                            onClose={closeDeleteModal}
                        />
                    )}
                    {/*user && bOpenDelete && (
                        <CapoEventPage
                            user={user}
                            fetchEvents={fetchEvents} />
                    )*/}
                </>
            )}
        </div>
    )
}