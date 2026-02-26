import {useState} from "react";
import "../../styles/DeleteModal.css";
import ConfirmModal from "./ConfirmModal.tsx";
import type {EditScope, PartOfSeriesDto} from "../../types/CapoEvent.ts";


type Props = {
    bOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    onConfirmTitle:string;
    onConfirmMsg:string;
    partOfSeries: PartOfSeriesDto
    editScope: EditScope;
    setEditScope: (scope: EditScope) => void;
};

export default function EditScopeModal({bOpen, onCancel, onConfirm, onConfirmTitle, onConfirmMsg, partOfSeries, editScope, setEditScope}: Readonly<Props>) {

    const [openConfirm, setOpenConfirm] = useState(false);

    if (!bOpen) return null;

    return (
        <div className="modal__backdrop">
            <div className="modal__panel">
                <h3 className="modal__title">{onConfirmTitle}</h3>
                <p></p>
                <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                    <label>
                        <input
                            type="radio"
                            name="editScope"
                            checked={editScope === "ONLY_THIS"}
                            onChange={() => setEditScope("ONLY_THIS")}
                        />{" "}
                        this one
                    </label>

                    {partOfSeries?.isPartOfSeries &&
                        <label>
                            <input
                                type="radio"
                                name="editScope"
                                checked={editScope === "ALL_IN_SERIES"}
                                onChange={() => setEditScope("ALL_IN_SERIES")}
                            />{" "}
                            all in this series
                        </label>
                    }

                    {partOfSeries?.hasBefore &&
                        <label>
                            <input
                                type="radio"
                                name="editScope"
                                checked={editScope === "BEFORE_THIS"}
                                onChange={() => setEditScope("BEFORE_THIS")}
                            />{" "}
                            this + all before (in this series)
                        </label>
                    }

                    {partOfSeries?.hasAfter &&
                        <label>
                            <input
                                type="radio"
                                name="editScope"
                                checked={editScope === "AFTER_THIS"}
                                onChange={() => setEditScope("AFTER_THIS")}
                            />{" "}
                            this + all after (in this series)
                        </label>
                    }
                </div>

                <div className="modal__actions">
                    <button className="modal__btn" type="button" onClick={onCancel}>
                        Cancel
                    </button>

                    <button
                        className="modal__btn modal__btn--danger"
                        type="button"
                        onClick={() => setOpenConfirm(true)}
                    >
                        {onConfirmTitle}
                    </button>
                </div>
            </div>

            <ConfirmModal
                bOpen={openConfirm}
                title={onConfirmTitle + " event?"}
                message={onConfirmMsg}
                confirmText= {"Yes, " + onConfirmTitle}
                cancelText="No"
                onCancel={() => setOpenConfirm(false)}
                onConfirm={() => {
                    setOpenConfirm(false);
                    onConfirm();
                }}
            />
        </div>
    );
}
