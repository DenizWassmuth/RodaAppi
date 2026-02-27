import CapoEventCard from "../CapoEventCard.tsx";
import "../../styles/CapoEventCard.css"
import "../../index.css"
import {useEffect, useState} from "react";
import EditCapoEventModal from "../modals/EditCapoEventModal.tsx";
import type {AppUserType} from "../../types/AppUser.ts";
import type {CapoEventType, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import {DeleteCapoEventModal} from "../modals/DeleteCapoEventModal.tsx";
import {checkIfPartOfSeries} from "../../utility/AxiosUtilities.ts";
import CapoEventDetailsCard from "./CapoEventDetailsCard.tsx";
import CreateAndEditModal from "../modals/Create&EditModal.tsx";

type PageProps = {
    user:AppUserType | null | undefined;
    bIsLoginArea: boolean;
    events:CapoEventType[];
    fetchEvents: () => Promise<void | string>;
    bookmarks:string[] | null;
}

export default function PreviewPage({user, bIsLoginArea, events, fetchEvents, bookmarks}: Readonly<PageProps>) {

    const [capoEvent, setCapoEvent] = useState<CapoEventType>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
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
        setOpenDelete(false);
    }

    function closeEditModal() {
        setOpenEdit(false);

        if (openDetails) {
            return;
        }

        setCapoEvent(null);
        setPartOfSeries(null);
    }

    function openDeleteModal(event: CapoEventType) {
        setCapoEvent(event);
        setOpenDelete(true);
    }

    function closeDeleteModal(bCancel:boolean) {
        setOpenDelete(false);

        if (openDetails && bCancel) {
            return;
        }

       closeDetailsPage();
    }

    function openDetailsPage(event: CapoEventType) {
        setCapoEvent(event);
        setOpenDetails(true);
    }

    function closeDetailsPage() {
        setCapoEvent(null);
        setOpenDetails(false);
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
                                        openDetailsPage={openDetailsPage}
                                    />
                                )
                            )
                    }
                </div>
            </main>

            { (
                <>
                    {capoEvent && openDetails && (
                    <CreateAndEditModal title={""} open={openDetails} onClose={() => closeDetailsPage()}>
                        <CapoEventDetailsCard
                            bOpen={openDetails}
                            user={user}
                            partOfSeries={partOfSeries}
                            capoEvent={capoEvent}
                            onClose={closeDetailsPage}
                            onEdit={() => openEditModal(capoEvent)}
                            onDelete={() => openDeleteModal(capoEvent)}
                        />
                    </CreateAndEditModal>)
                }
                    {user && openEdit && (
                        <EditCapoEventModal
                            bOpen={openEdit}
                            event={capoEvent}
                            setCapoEvent={setCapoEvent}
                            partOfSeries={partOfSeries}
                            user={user}
                            fetchEvents={fetchEvents}
                            onClose={closeEditModal}
                        />
                    )}
                    {user && openDelete && partOfSeries && (
                        <DeleteCapoEventModal
                            bOpen={openDelete}
                            eventId={capoEvent?.id}
                            partOfSeries={partOfSeries}
                            user={user}
                            fetchEvents={fetchEvents}
                            onClose={closeDeleteModal}
                        />
                    )}

                </>
            )}
        </div>
    )
}