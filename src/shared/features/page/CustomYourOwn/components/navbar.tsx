"use client";

import { CiFileOn } from "react-icons/ci";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import {
    ChevronDown,
    Download,
    Loader,
    MousePointerClick,
    Redo2,
    Undo2
} from "lucide-react";

import { ActiveTool, Editor } from "../types";
import { Logo } from "./logo";

import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
    id: string;
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
    tshirtColor?: string;
    onTshirtColorChange?: (color: string) => void;
};

export const Navbar = ({
    id,
    editor,
    activeTool,
    onChangeActiveTool,
    tshirtColor = "#000000",
    onTshirtColorChange,
}: NavbarProps) => {
    return (
        <nav className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px] bg-white">
            <div className="font-bold text-lg">Create your own</div>
            <div className="w-full flex items-center gap-x-1 h-full">
                <button
                    onClick={() => onChangeActiveTool("select")}
                    className={`p-2 rounded transition ${activeTool === "select" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                    title="Select"
                >
                    <MousePointerClick className="size-4" />
                </button>
                <button
                    disabled={!editor?.canUndo()}
                    onClick={() => editor?.onUndo()}
                    className={`p-2 rounded transition ${!editor?.canUndo() ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
                    title="Undo"
                >
                    <Undo2 className="size-4" />
                </button>
                <button
                    disabled={!editor?.canRedo()}
                    onClick={() => editor?.onRedo()}
                    className={`p-2 rounded transition ${!editor?.canRedo() ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
                    title="Redo"
                >
                    <Redo2 className="size-4" />
                </button>
                <div className="flex items-center gap-x-2 ml-auto">
                    <BsCloudCheck className="size-4 text-muted-foreground" />
                </div>
            </div>
            <div className="flex items-center gap-x-2 h-full">
                <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition">
                        <Download className="size-4" />
                        Download
                        <ChevronDown className="size-4" />
                    </button>
                    <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-white border rounded shadow-lg">
                        <button
                            onClick={() => editor?.saveJson()}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 border-b"
                        >
                            JSON
                        </button>
                        <button
                            onClick={() => editor?.savePng()}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 border-b"
                        >
                            PNG
                        </button>
                        <button
                            onClick={() => editor?.saveJpg()}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 border-b"
                        >
                            JPG
                        </button>
                        <button
                            onClick={() => editor?.saveSvg()}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                            SVG
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
