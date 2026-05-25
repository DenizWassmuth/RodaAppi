import {useState} from "react";
import "../../styles/DeleteModal.css";
import ConfirmModal from "./ConfirmModal.tsx";
import type {EditScope, PartOfSeriesDto} from "../../types/CapoEvent.ts";
import {AnimatePresence} from "framer-motion";


type EditScopeModalProps = {
    bOpen: boolean;
    onConfirm: () => void;
    onConfirmTitle:string;
    onConfirmMsg:string;
    partOfSeries: PartOfSeriesDto
    editScope: EditScope;
    setEditScope: (scope: EditScope) => void;
};

export default function EditScopeModal({bOpen, onConfirm, onConfirmTitle, onConfirmMsg, partOfSeries, editScope, setEditScope}: Readonly<EditScopeModalProps>) {

    const [openConfirm, setOpenConfirm] = useState(false);

    if (!bOpen) return null;

    return (
        <>
            <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                <label>
                    <input
                        type="radio"
                        name="editScope"
                        checked={editScope === "ONLY_THIS"}
                        onChange={() => setEditScope("ONLY_THIS")}
                    />
                    {" "} this one
                </label>

                {partOfSeries?.isPartOfSeries &&
                    <label>
                        <input
                            type="radio"
                            name="editScope"
                            checked={editScope === "ALL_IN_SERIES"}
                            onChange={() => setEditScope("ALL_IN_SERIES")}
                        />
                        {" "} all in this series
                    </label>
                }

                {partOfSeries?.hasBefore &&
                    <label>
                        <input
                            type="radio"
                            name="editScope"
                            checked={editScope === "BEFORE_THIS"}
                            onChange={() => setEditScope("BEFORE_THIS")}
                        />
                        {" "} this + all before (in this series)
                    </label>
                }

                {partOfSeries?.hasAfter &&
                    <label>
                        <input
                            type="radio"
                            name="editScope"
                            checked={editScope === "AFTER_THIS"}
                            onChange={() => setEditScope("AFTER_THIS")}
                        />
                        {" "} this + all after (in this series)
                    </label>
                }
            </div>

            <div className="flex justify-center gap-2.5">
                <button
                    type="button"
                    onClick={(e) => {e.preventDefault(); setOpenConfirm(true)}}
                    className="cursor-pointer p-2 text-white rounded-lg border border-neutral-500 bg-red-900 hover:bg-red-800"
                >
                    {onConfirmTitle}
                </button>
            </div>

            <AnimatePresence>
                {openConfirm && (
                    <ConfirmModal
                        key="confirm-modal"
                        bOpen={openConfirm}
                        title={onConfirmTitle + " event?"}
                        message={onConfirmMsg}
                        confirmText= {"Yes, " + onConfirmTitle}
                        onCancel={() =>
                            setOpenConfirm(false)}
                        onConfirm={() => {
                            setOpenConfirm(false);
                            onConfirm();
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
