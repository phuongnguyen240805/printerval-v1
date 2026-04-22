import { ReactNode } from "react";

interface HintProps {
    label: string;
    children: ReactNode;
    side?: "top" | "right" | "bottom" | "left";
}

export const Hint = ({ label, children, side = "top" }: HintProps) => {
    return (
        <div className="relative group">
            {children}
            <div className="absolute z-50 hidden group-hover:block bg-black text-white text-xs rounded p-1 whitespace-nowrap pointer-events-none">
                {label}
            </div>
        </div>
    );
};
