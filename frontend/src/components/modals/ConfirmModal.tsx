import "../../styles/Modal.css";

type Props = {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal(props: Props) {

    if (!props.open) return null;

    return (
        <div className="modal__backdrop" onClick={props.onCancel}>
            <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal__title">{props.title}</h3>
                <p className="modal__message">{props.message}</p>

                <div className="modal__actions">
                    <button className="modal__btn" type="button" onClick={props.onCancel}>
                        {props.cancelText ?? "Cancel"}
                    </button>

                    <button className="modal__btn modal__btn--danger" type="button" onClick={props.onConfirm}>
                        {props.confirmText ?? "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
