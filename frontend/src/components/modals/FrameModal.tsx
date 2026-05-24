
import "../../styles/FrameModal.css"
import {useEffect, type ReactNode} from "react";
import {motion} from "framer-motion";

type FrameModalProps = {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
};

export default function FrameModal({open, title, onClose, children}: Readonly<FrameModalProps>) {

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);

    return (
        <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            exit={{ opacity: 0}}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 grid place-items-center bg-black/80 z-30">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 100, damping: 15 }}
                className="w-[min(900px,94vw)] max-h-[90vh] overflow-auto no-scrollbar bg-neutral-900 border border-amber-500 rounded-xl text-white p-3.5">
                <div className="mb-2 flex items-center justify-between gap-2.5">
                    {title && <h2 className="m-0 text-[22px]">{title}</h2>}
                    <button
                        title="Close"
                        type="button"
                        onClick={ (e) =>{onClose(); e.preventDefault() }}
                        className="cursor-pointer rounded-lg border border-neutral-500 bg-neutral-800 px-2.5 py-1.5 text-white"
                    >
                        ✕
                    </button>
                </div>
                <div className="pb-4">{children}</div>
            </motion.div>
        </motion.div>
    );
}
