
import "../../styles/Create&EditModal.css"
import type {ReactNode} from "react";

type Props = {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
};

export default function CreateAndEditModal({open, title, onClose, children}: Readonly<Props>) {

    if (!open) return null;

    return (
        <div className="modal__backdrop">
            <div className="modal__panel">
                <div className="modal__header">
                    {title && <h2 className="modal__title">{title}</h2>}
                    <button className="modal__close" type="button" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className="modal__content">{children}</div>
            </div>
        </div>
    );
}
