
import "../../styles/Create&EditModal.css"
import type {ReactNode} from "react";

type Props = {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: ReactNode;
};

export default function CreateAndEditModal(props: Readonly<Props>) {

    if (!props.open) return null;

    function handleBackdropKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            props.onClose();
        }
    }

    return (
        <div
            className="modal__backdrop"
            role="button"
            tabIndex={0}
            aria-label="Close dialog"
            onClick={props.onClose}
            onKeyDown={handleBackdropKeyDown}
        >
            <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    {props.title && <h2 className="modal__title">{props.title}</h2>}
                    <button className="modal__close" type="button" onClick={props.onClose}>
                        ✕
                    </button>
                </div>
                <div className="modal__content">{props.children}</div>
            </div>
        </div>
    );
}
