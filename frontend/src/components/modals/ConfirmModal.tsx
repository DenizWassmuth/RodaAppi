import "../../styles/DeleteModal.css";

type Props = {
    bOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal(props:Readonly<Props>) {

    if (!props.bOpen) return null;

    return (
        <div
            className="modal__backdrop"
        >
            <div className="modal__panel">
                <h3 className="modal__title">{props.title}</h3>
                <p></p>
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
