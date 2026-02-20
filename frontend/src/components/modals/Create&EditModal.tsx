
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

    return (
        <div className="modal__backdrop" onClick={props.onClose}>
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
