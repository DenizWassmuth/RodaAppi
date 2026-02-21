import {useState} from "react";
import "../../styles/DeleteModal.css";
import ConfirmModal from "./ConfirmModal.tsx";
import type {PartOfSeriesDto} from "../../types/CapoEvent.ts";


export type DeleteScope = "ONLY_THIS" | "ALL_IN_SERIES" | "BEFORE_THIS" | "AFTER_THIS";

type Props = {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    partOfSeries: PartOfSeriesDto
    //deleteScope?: DeleteScope;
    setDeleteScope: (scope: DeleteScope) => void;
};


export default function DeleteOptionsModal(props: Readonly<Props>) {

    const [confirmOpen, setConfirmOpen] = useState(false);

    if (!props.open) return null;

    return (
        <div
            className="modal__backdrop"
        >
            <div className="modal__panel">
                <h3 className="modal__title">Delete</h3>
                <p></p>
                <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                    <label>
                        <input
                            type="radio"
                            name="deleteScope"
                            //checked={props.deleteScope === "ONLY_THIS"}
                            onChange={() => props.setDeleteScope("ONLY_THIS")}
                        />{" "}
                        this one
                    </label>

                    {props.partOfSeries?.isPartOfSeries &&
                        <label>
                            <input
                                type="radio"
                                name="deleteScope"
                                //checked={props.deleteScope === "ALL_IN_SERIES"}
                                onChange={() => props.setDeleteScope("ALL_IN_SERIES")}
                            />{" "}
                            all in this series
                        </label>
                    }

                    {props.partOfSeries?.hasBefore &&
                        <label>
                            <input
                                type="radio"
                                name="deleteScope"
                                //checked={props.deleteScope === "BEFORE_THIS"}
                                onChange={() => props.setDeleteScope("BEFORE_THIS")}
                            />{" "}
                            this + all before (in this series)
                        </label>
                    }

                    {props.partOfSeries?.hasAfter &&
                        <label>
                            <input
                                type="radio"
                                name="deleteScope"
                                //checked={props.deleteScope === "AFTER_THIS"}
                                onChange={() => props.setDeleteScope("AFTER_THIS")}
                            />{" "}
                            this + all after (in this series)
                        </label>
                    }
                </div>

                <div className="modal__actions">
                    <button className="modal__btn" type="button" onClick={props.onCancel}>
                        Cancel
                    </button>

                    <button
                        className="modal__btn modal__btn--danger"
                        type="button"
                        onClick={() => setConfirmOpen(true) }
                    >
                        Delete
                    </button>
                </div>
            </div>

            <ConfirmModal
                open={confirmOpen}
                title="Delete event?"
                message="This cannot be undone."
                confirmText="Yes, delete"
                cancelText="No"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    setConfirmOpen(false);
                    props.onConfirm();
                }}
            />
        </div>
    );
}
