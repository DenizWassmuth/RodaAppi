import {motion} from "framer-motion";

type ButtonProps = {
    buttonId: string;
    name: string;
    onClick: () => void;
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
                e.preventDefault();
                onClick();
            }}
            className={"text-zinc-200 rounded-[10px] border-2 border-solid border-yellow-500 px-2 py-1.5 hover:cursor-pointer"}
        >
            {name}
        </motion.button>
    )
}