import {motion} from "framer-motion";
import React from "react";

type ButtonProps = {
    buttonId: string;
    name: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function StdButton({buttonId, name, onClick }: ButtonProps) {
    return (
        <motion.button
            id={buttonId}
            type="button"
            title={name}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: .1 }}
            onClick={(e) => {
                onClick(e);
            }}
            className={"text-zinc-200 rounded-lg border-2 border-solid border-yellow-600 px-2 py-1 hover:cursor-pointer"}
        >
            {name}
        </motion.button>
    )
}