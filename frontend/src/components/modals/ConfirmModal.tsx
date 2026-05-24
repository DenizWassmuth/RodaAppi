import FrameModal from "./FrameModal.tsx";
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
        <FrameModal title={title} open={bOpen} onClose={onCancel}>
            <p className="modal__message">{message}</p>

            <div className="modal__actions">
                <button className="modal__btn" type="button" onClick={onCancel}>
                    {cancelText ?? "Cancel"}
                </button>

                <button className="modal__btn modal__btn--danger" type="button" onClick={(e) => {
                    e.preventDefault(); onConfirm()}}>
                    {confirmText ?? "Confirm"}
                </button>
            </div>
        </FrameModal>
    );
}
