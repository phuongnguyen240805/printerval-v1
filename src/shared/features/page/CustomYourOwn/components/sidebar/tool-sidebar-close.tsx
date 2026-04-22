import { ChevronsLeft } from "lucide-react";
import { ReactNode } from "react";

interface ToolSidebarCloseProps {
    onClose: () => void;
    children?: ReactNode;
};

export const ToolSidebarClose = ({
    onClose,
    children,
}: ToolSidebarCloseProps) => {
    return (
        <>
            {children}
            <button
                onClick={onClose}
                className="absolute -right-[1.80rem] h-[70px] bg-white dark:bg-slate-900 top-1/2 transform -translate-y-1/2 flex items-center justify-center rounded-r-xl px-1 pr-2 border-r border-y group"
            >
                <ChevronsLeft className="size-4 text-black dark:text-white group-hover:opacity-75 transition" />
            </button>
        </>
    );
};
