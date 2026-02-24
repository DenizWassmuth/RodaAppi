import CapoEventCard from "../CapoEventCard.tsx";
import "../../styles/CapoEventCard.css"
import "../../index.css"
import {useEffect, useState} from "react";
import EditCapoEventModal from "../modals/EditCapoEventModal.tsx";
import type {AppUserType} from "../../types/AppUser.ts";
import type {CapoEventType, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import {DeleteCapoEventModal} from "../modals/DeleteCapoEventModal.tsx";
import {checkIfPartOfSeries} from "../../utility/AxiosUtilities.ts";

export type PageProps = {
    user:AppUserType | null | undefined;
    bIsLoginArea: boolean;
    events:CapoEventType[];
    fetchEvents: () => Promise<void | string>;
}

export default function PreviewPage(props: Readonly<PageProps>) {

    const [capoEvent, setCapoEvent] = useState<CapoEventType>(null);
    const [bOpenModals, setOpenModals] = useState<boolean>(false);
    const [bOpenEdit, setOpenEdit] = useState(false);
    const [bOpenDelete, setOpenDelete] = useState(false);
    const [partOfSeries, setPartOfSeries] = useState<PartOfSeriesDto>(null);

    useEffect(() => {
        if (!capoEvent) {
            return;
        }
        checkIfPartOfSeries(capoEvent, setPartOfSeries).then(() => setOpenModals(true));
    }, [capoEvent])

    function openEditModal(event: CapoEventType) {
        setCapoEvent(event);
        setOpenEdit(true);
    }

    function closeEditModal() {
        setOpenEdit(false);
        setOpenModals(false)
        setCapoEvent(null);
        setPartOfSeries(null);
    }

    function openDeleteModal(event: CapoEventType) {
        setCapoEvent(event);
        setOpenDelete(true);
    }

    function closeDeleteModal() {
        setOpenDelete(false);
        setOpenModals(false)
        setCapoEvent(null);
        setPartOfSeries(null);
    }

    let eventsToMap = props.events;
    if (props.user && props.bIsLoginArea){
       eventsToMap = props.events
           .filter((capoEvent) => capoEvent?.creatorId === props.user?.id);
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
                                        user={props.user}
                                        onHandleEdit={openEditModal}
                                        onHandleDelete={openDeleteModal} />
                                )
                            )
                    }
                </div>
            </main>

            {bOpenModals && (
                <>
                    {props.user && bOpenEdit && (
                        <EditCapoEventModal
                            bOpen={bOpenEdit}
                            event={capoEvent}
                            partOfSeries={partOfSeries}
                            user={props.user}
                            fetchEvents={props.fetchEvents}
                            onClose={closeEditModal}
                        />
                    )}
                    {props.user && bOpenDelete && (
                        <DeleteCapoEventModal
                            bOpen={bOpenDelete}
                            eventId={capoEvent?.id}
                            partOfSeries={partOfSeries}
                            user={props.user}
                            fetchEvents={props.fetchEvents}
                            onClose={closeDeleteModal}
                        />
                    )}
                </>
            )}
        </div>
    )
}