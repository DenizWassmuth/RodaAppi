import EditScopeModal from "./EditScopeModal.tsx";
import {useState} from "react";
import type {EditScope, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import {deleteCapoEvent} from "../../utility/AxiosUtilities.ts";
import type {AppUserType} from "../../types/AppUser.ts";

type Props = {
    bOpen: boolean;
    eventId: string | null | undefined;
    user: AppUserType | undefined | null
    fetchEvents: () => Promise<void | string>
    onClose: (bCancel:boolean) => void;
    partOfSeries: PartOfSeriesDto;
}

export function DeleteCapoEventModal({bOpen, eventId, user, partOfSeries, onClose, fetchEvents}:Readonly<Props>){

    const [editScope, setEditScope] = useState<EditScope>("ONLY_THIS");

    if(!bOpen || !user){
        return null;
    }

    function handleDelete() {
        deleteCapoEvent(user?.id, eventId, editScope)
            .catch((error) => {
                console.log("could not delete capoEvent through CapoEventCard: " + error.toString())
            })
            .finally(() => {
                fetchEvents()
                    .then(() => setEditScope("ONLY_THIS"))
            .then(() => onClose(false))});
    }

    return (
        <EditScopeModal
            bOpen={bOpen}
            partOfSeries={partOfSeries}
            editScope={editScope}
            setEditScope={setEditScope}
            onConfirm={async () => {
                handleDelete();
            }}
            onConfirmTitle={"Delete"}
            onConfirmMsg={"This cannot be undone."}
            onCancel={() => onClose(true)}
        />

    )
}