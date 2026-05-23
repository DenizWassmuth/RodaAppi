import EventPreviewCard from "../EventPreviewCard.tsx";
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
import {AnimatePresence, motion} from "framer-motion";

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
    const { events, refreshEvents, loading } = useEvents();

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
        <div className={"relative min-h-screen max-h-full max-w-full mt-24 no-scrollbar"}>
            {bShowAddButton && (
                <button
                    type="button"
                    title="Add Event"
                    onClick={() => setActiveModal({ type: 'CREATE', event: null })}
                    className={"absolute z-1 left-1/2 -translate-x-1/2 -translate-y-6 h-10 w-10 grid place-items-center rounded-full border border-white/25 bg-black/45 text-[28px] text-white cursor-pointer"}
                >
                    <span className="-translate-y-0.5 leading-none">+</span>
                </button>
            )}
            <div className={`grid grid-cols-3 items-start auto-rows-max gap-2 pt-6 transition-opacity duration-500 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                <AnimatePresence mode="popLayout">
                    {events.map(capoEvent => (
                        <motion.div layoutId={"event-card"+capoEvent?.id}
                            key={capoEvent?.id}
                            layout={"position"}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                                opacity: { duration: 0.2 },
                                layout: { type: "spring", stiffness: 80, damping: 18 },
                            }}
                        >
                            <EventPreviewCard
                                capoEvent={capoEvent}
                                onHandleEdit={(e) => setActiveModal({ type: 'EDIT', event: e })}
                                onHandleDelete={(e) => setActiveModal({ type: 'DELETE', event: e })}
                                openDetailsPage={(e) => setActiveModal({ type: 'DETAILS', event: e })}
                            />
                        </motion.div>
                    ))}


            {/* MODAL CONTROLLER SECTION */}
            {activeModal && (
                <>
                    {/* 1. DETAILS MODAL */}
                    <motion.div layoutId={"event-card"+activeModal.event?.id}>
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
                    </motion.div>

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
                </AnimatePresence>
            </div>
        </div>
    )
}