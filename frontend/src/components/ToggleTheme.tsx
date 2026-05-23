import {moonIcon, sunIcon} from "../assets/Icons.tsx";

import {useEffect, useRef, useState} from "react";
import type {ReactNode} from "react";
import {motion} from "framer-motion";

interface ToggleProps {
    children: ReactNode;
}

export default function Toggle({children}: ToggleProps) {
    const [darkTheme, setDarkTheme] = useState(false);
    const mainRef = useRef<HTMLElement>(null);

    const applyTheme = (isDark: boolean) => {
        if (!mainRef.current) return;

        mainRef.current.classList.toggle("dark", isDark);
        setDarkTheme(isDark);
        localStorage.setItem("darkTheme", JSON.stringify(isDark));
    };

    const toggleTheme = () => {
        applyTheme(!darkTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("darkTheme");
        const systemTheme = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme === undefined || savedTheme === null) {
            applyTheme(systemTheme);
            return;
        }

        applyTheme(JSON.parse(savedTheme));

    }, []);

    return (
        <main ref={mainRef}>
            {/* look at App.css for theme-mode class */}
            <div className={"theme-mode min-h-screen"}>
                <div
                    className={"max-xl:w-full flex flex-col justify-center px-10 overflow-hidden no-scrollbar"}>
                    <button
                        title={"toggle dark mode"}
                        onClick={toggleTheme}
                        className={"fixed right-10 top-4 text-gray-900 hover:text-gray-800 dark:text-yellow-600 dark:hover:text-yellow-500 transition-colors duration-500 z-50"}>
                        <motion.span
                            animate={{scale: darkTheme ? 1 : 0}}
                            className={"absolute block rounded-full bg-amber-100 dark:bg-zinc-800 transition-colors duration-500 p-0 text-4xl"}
                        >
                            {moonIcon}
                        </motion.span>
                        <motion.span
                            animate={{scale: darkTheme ? 0 : 1, animationDuration: 0.5}}
                            className={"absolute block rounded-full bg-amber-100 dark:bg-zinc-800 transition-colors duration-500 p-0 text-4xl"}
                        >
                            {sunIcon}
                        </motion.span>
                    </button>
                    {children}
                </div>
            </div>
        </main>
    )
}