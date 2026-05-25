import FrameModal from "./FrameModal.tsx";
import "../../styles/DeleteModal.css";

type Props = {
    bOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({bOpen, title, message, confirmText, onConfirm, onCancel}:Readonly<Props>) {

    if (!bOpen) return null;

    return (
        <FrameModal title={title} open={bOpen} onClose={onCancel}>
            <p className="mb-4 text-zinc-200">{message}</p>

            <div className="flex justify-center gap-2.5">
                <button
                    type="button"
                    onClick={(e) => {
                    e.preventDefault(); onConfirm()}}
                    className="cursor-pointer p-2 text-white rounded-lg border border-neutral-500 bg-red-900 hover:bg-red-800"
                >
                    {confirmText ?? "Confirm"}
                </button>
            </div>
        </FrameModal>
    );
}
