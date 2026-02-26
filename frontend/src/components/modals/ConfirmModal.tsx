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

export default function ConfirmModal({bOpen, title, message, confirmText, cancelText, onConfirm, onCancel}:Readonly<Props>) {

    if (!bOpen) return null;

    return (
        <div
            className="modal__backdrop"
        >
            <div className="modal__panel">
                <h3 className="modal__title">{title}</h3>
                <p></p>
                <p className="modal__message">{message}</p>

                <div className="modal__actions">
                    <button className="modal__btn" type="button" onClick={onCancel}>
                        {cancelText ?? "Cancel"}
                    </button>

                    <button className="modal__btn modal__btn--danger" type="button" onClick={onConfirm}>
                        {confirmText ?? "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
