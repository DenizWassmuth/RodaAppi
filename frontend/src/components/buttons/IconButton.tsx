import { motion } from "framer-motion";
import React, { type ComponentType } from "react";

type IconButtonProps = {
    buttonId: string;
    title: string;
    icon: ComponentType<{ size?: number | string; className?: string }>;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
};

export default function IconButton({ buttonId, title, icon: Icon, onClick, className }: IconButtonProps) {
    return (
        <motion.button
            id={buttonId}
            type="button"
            title={title}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: .1 }}
            onClick={(e) => {
                onClick(e);
            }}
            className={className ?? "text-zinc-200 rounded-lg px-2 py-1 hover:cursor-pointer"}
        >
            <Icon size={20} />
        </motion.button>
    )
}