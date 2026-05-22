import EventPreviewCard from "../EventPreviewCard.tsx";
import "../../styles/CapoEventPreviewCard.css"
import "../../index.css"
import {useEffect, useState} from "react";
import EditEventModal from "../modals/EditEventModal.tsx";
import type {CapoEventType, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import {DeleteEventModal} from "../modals/DeleteEventModal.tsx";
import {checkIfPartOfSeries} from "../../utility/AxiosUtilities.ts";
import EventDetailsCard from "../EventDetailsCard.tsx";
import FrameModal from "../modals/FrameModal.tsx";
import {useAuth} from "../../context/AuthContext.ts";
import {useEvents} from "../../context/EventContext.ts";
import CreateEventModal from "../modals/CreateEventModal.tsx";
import type {CountryData} from "../../types/GeoData.ts";


/**
 * Defines the possible states for the centralized modal system.
 * Using a Discriminated Union ensures we always have the right data for the right modal.
 */
type ActiveModal = 
    | { type: 'DETAILS'; event: CapoEventType }
    | { type: 'CREATE'; event: CapoEventType }
    | { type: 'EDIT'; event: CapoEventType }
    | { type: 'DELETE'; event: CapoEventType }
    | null;

type PreviewProps = {
   countries: CountryData[],
};

export default function PreviewPage({countries}: PreviewProps) {
    const { user } = useAuth();
    const { events, refreshEvents } = useEvents();

    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const [partOfSeries, setPartOfSeries] = useState<PartOfSeriesDto>(null);

    useEffect(() => {
        if (!activeModal?.event) {
            setPartOfSeries(null);
            return;
        }

        checkIfPartOfSeries(activeModal.event, setPartOfSeries).then();
    }, [activeModal?.event])

    const bShowAddButton = Boolean(user);

    const closeModal = () => setActiveModal(null);

    return (
        <div className="page_layout">
            {bShowAddButton && (
                <button
                    type="button"
                    className="add_fab"
                    onClick={() => setActiveModal({ type: 'CREATE', event: null })}
                    aria-label="Add event"
                    title="Add event"
                >
                    +
                </button>
            )}
            <div className="events_row">
                {events.map(capoEvent => (
                    <EventPreviewCard
                        key={capoEvent?.id}
                        capoEvent={capoEvent}
                        onHandleEdit={(e) => setActiveModal({ type: 'EDIT', event: e })}
                        onHandleDelete={(e) => setActiveModal({ type: 'DELETE', event: e })}
                        openDetailsPage={(e) => setActiveModal({ type: 'DETAILS', event: e })}
                    />
                ))}
            </div>

            {/* MODAL CONTROLLER SECTION */}
            {activeModal && (
                <>
                    {/* 1. DETAILS MODAL */}
                    {activeModal.type === 'DETAILS' && activeModal.event && (
                        <FrameModal title={""} open={true} onClose={closeModal}>
                            <EventDetailsCard
                                key={"details" + activeModal.event.id}
                                bOpen={true}
                                partOfSeries={partOfSeries}
                                capoEvent={activeModal.event}
                                onEdit={() => setActiveModal({ type: 'EDIT', event: activeModal.event })}
                                onDelete={() => setActiveModal({ type: 'DELETE', event: activeModal.event })}
                            />
                        </FrameModal>
                    )}

                    {/* 2. CREATE MODAL */}
                    {activeModal.type === 'CREATE' && user && (
                        <CreateEventModal
                            key={"create"}
                            bOpenForm={activeModal.type === 'CREATE'}
                            onClose={closeModal}
                            countries={countries}
                        />
                    )}

                    {/* 3. EDIT MODAL */}
                    {activeModal.type === 'EDIT' && user && activeModal.event && (
                        <EditEventModal
                            key={"edit" + activeModal.event.id}
                            bOpen={true}
                            event={activeModal.event}
                            setCapoEvent={(updated) => setActiveModal({ type: 'DETAILS', event: updated })}
                            partOfSeries={partOfSeries}
                            fetchEvents={refreshEvents}
                            onClose={closeModal}
                        />
                    )}

                    {/* 4. DELETE MODAL */}
                    {activeModal.type === 'DELETE' && user && activeModal.event && partOfSeries && (
                        <DeleteEventModal
                            key={"delete" + activeModal.event.id}
                            bOpen={true}
                            eventId={activeModal.event.id}
                            partOfSeries={partOfSeries}
                            fetchEvents={refreshEvents}
                            onClose={(bCancel) => bCancel ? closeModal() : closeModal()}
                        />
                    )}
                </>
            )}
        </div>
    )
}