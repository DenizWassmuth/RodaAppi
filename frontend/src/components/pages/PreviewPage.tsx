import CapoEventPreviewCard from "../CapoEventPreviewCard.tsx";
import "../../styles/CapoEventPreviewCard.css"
import "../../index.css"
import {useEffect, useState} from "react";
import EditCapoEventModal from "../modals/EditCapoEventModal.tsx";
import type {AppUserType} from "../../types/AppUser.ts";
import type {CapoEventType, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import {DeleteCapoEventModal} from "../modals/DeleteCapoEventModal.tsx";
import {checkIfPartOfSeries} from "../../utility/AxiosUtilities.ts";
import CapoEventDetailsCard from "./CapoEventDetailsCard.tsx";
import FrameModal from "../modals/FrameModal.tsx";

type PageProps = {
    user:AppUserType | null | undefined;
    events:CapoEventType[];
    fetchEvents: () => Promise<void | string>;
    bookmarks:string[] | null;
    getUserBookmarks: () => void;
}

export default function PreviewPage({user, events, fetchEvents, bookmarks, getUserBookmarks}: Readonly<PageProps>) {

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

    return (
        <div>
            <main className="page_layout">
                <div className="events_row">
                    {
                        events
                            .map(capoEvent => (
                                    <CapoEventPreviewCard
                                        key={capoEvent?.id}
                                        user={user}
                                        capoEvent={capoEvent}
                                        bookmarks={bookmarks}
                                        onHandleEdit={openEditModal}
                                        onHandleDelete={openDeleteModal}
                                        openDetailsPage={openDetailsPage}
                                        onHandleGetBookmarks={getUserBookmarks}
                                    />
                                )
                            )
                    }
                </div>
            </main>

            {(
                <>
                    {capoEvent && openDetails && (
                    <FrameModal title={""} open={openDetails} onClose={() => closeDetailsPage()}>
                        <CapoEventDetailsCard
                            key={"details"+capoEvent?.id}
                            bOpen={openDetails}
                            user={user}
                            partOfSeries={partOfSeries}
                            capoEvent={capoEvent}
                            onEdit={() => openEditModal(capoEvent)}
                            onDelete={() => openDeleteModal(capoEvent)}
                            bookmarks={bookmarks}
                            onHandleGetBookmarks={getUserBookmarks}
                        />
                    </FrameModal>
                    )}
                    {user && openEdit && (
                        <EditCapoEventModal
                            key={"edit"+capoEvent?.id}
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
                            key={"delete"+capoEvent?.id}
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