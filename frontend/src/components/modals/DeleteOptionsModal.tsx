import { useState } from "react";
import "../../styles/DeleteModal.css";
import ConfirmModal from "./ConfirmModal.tsx";

export type DeleteScope = "ONLY_THIS" | "ALL_IN_SERIES" | "BEFORE_THIS" | "AFTER_THIS";

type Props = {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    deleteScope?: DeleteScope;
    setScope: (scope: DeleteScope) => void;
};

export default function DeleteOptionsModal(props: Props) {

    const [confirmOpen, setConfirmOpen] = useState(false);
    //const [scope, setScope] = useState<DeleteScope>(props.defaultScope ?? "ONLY_THIS");

    if (!props.open) return null;

    return (
        <div className="modal__backdrop" onClick={props.onCancel}>
            <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal__title">Delete which events?</h3>
                <p className="modal__message">Choose what should be deleted.</p>

                <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                    <label>
                        <input
                            type="radio"
                            name="deleteScope"
                            checked={props.deleteScope === "ONLY_THIS"}
                            onChange={() => props.setScope("ONLY_THIS")}
                        />{" "}
                        this one
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="deleteScope"
                            checked={props.deleteScope === "ALL_IN_SERIES"}
                            onChange={() => props.setScope("ALL_IN_SERIES")}
                        />{" "}
                        all in this series
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="deleteScope"
                            checked={props.deleteScope === "BEFORE_THIS"}
                            onChange={() => props.setScope("BEFORE_THIS")}
                        />{" "}
                       this + all before (in this series)
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="deleteScope"
                            checked={props.deleteScope === "AFTER_THIS"}
                            onChange={() => props.setScope("AFTER_THIS")}
                        />{" "}
                        this + all after (in this series)
                    </label>
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
