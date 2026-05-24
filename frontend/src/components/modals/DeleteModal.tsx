import EditScopeModal from "./EditScopeModal.tsx";
import {useState} from "react";
import type {EditScope, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import {deleteCapoEvent} from "../../utility/AxiosUtilities.ts";
import {useAuth} from "../../context/AuthContext.ts";
import FrameModal from "./FrameModal.tsx";

type Props = {
    bOpen: boolean;
    eventId: string | null | undefined;
    fetchEvents: () => Promise<void | string>
    onClose: () => void;
    partOfSeries: PartOfSeriesDto;
}

export function DeleteModal({bOpen, eventId, partOfSeries, onClose, fetchEvents}:Readonly<Props>){
    const { user } = useAuth();
    const [editScope, setEditScope] = useState<EditScope>("ONLY_THIS");

    if(!bOpen || !user){
        return null;
    }

    function handleDelete() {
        deleteCapoEvent(user?.id, eventId, editScope)
            .catch((error) => {
                console.log("could not delete capoEvent through EventPreviewCard: " + error.toString())
            })
            .finally(() => {
                fetchEvents()
                    .then(() => setEditScope("ONLY_THIS"))
            .then(() => onClose())});
    }

    return (
        <FrameModal title={"Delete Event"} open={bOpen} onClose={onClose}>
            <EditScopeModal
                bOpen={bOpen}
                partOfSeries={partOfSeries}
                editScope={editScope}
                setEditScope={setEditScope}
                onConfirm={handleDelete}
                onConfirmTitle={"Delete"}
                onConfirmMsg={"This cannot be undone."}
            />
        </FrameModal>
    )
}