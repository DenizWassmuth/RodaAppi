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
import {useNavigate} from "react-router-dom";

type PageProps = {
    user:AppUserType | null | undefined;
    events:CapoEventType[];
    fetchEvents: () => Promise<void | string>;
    bookmarkedSet: ReadonlySet<string> | null;
    fetchBookmarks: () => void;
    bOnDashboard:boolean;
}

export default function PreviewPage({user, events, fetchEvents, bookmarkedSet, fetchBookmarks, bOnDashboard}: Readonly<PageProps>) {

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

    const nav = useNavigate();
    const showAdd = Boolean(bOnDashboard) && Boolean(user);

    return (

        <div className="page_layout">
            {showAdd && (
                <button
                    type="button"
                    className="add_fab"
                    onClick={() => nav("/add")}
                    aria-label="Add event"
                    title="Add event"
                >
                    +
                </button>
            )}
                <div className="events_row">
                    {
                        events
                            .map(capoEvent => (
                                    <CapoEventPreviewCard
                                        key={capoEvent?.id}
                                        user={user}
                                        capoEvent={capoEvent}
                                        bookmarkedSet={bookmarkedSet}
                                        onHandleEdit={openEditModal}
                                        onHandleDelete={openDeleteModal}
                                        openDetailsPage={openDetailsPage}
                                        onHandleGetBookmarks={fetchBookmarks}
                                    />
                                )
                            )
                    }
                </div>
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
                            bookmarkedSet={bookmarkedSet}
                            onHandleGetBookmarks={fetchBookmarks}
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