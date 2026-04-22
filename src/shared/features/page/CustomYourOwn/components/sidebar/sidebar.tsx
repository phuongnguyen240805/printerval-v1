"use client";

import {
    Layout,
    LayoutTemplate,
    ImageIcon,
    Pencil,
    Settings,
    Shapes,
    Sparkles,
    Type,
    PenTool,
    Wand2,
} from "lucide-react";

import { ActiveTool } from "../../types";

interface SidebarProps {
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
};

export const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
    const tools = [
        // {
        //     id: "select" as const,
        //     label: "Design",
        //     icon: Layout,
        // },
        {
            id: "images" as const,
            label: "Image",
            icon: ImageIcon,
        },
        {
            id: "category-images" as const,
            label: "Categories",
            icon: Layout,
        },
        {
            id: "text" as const,
            label: "Text",
            icon: Type,
        },
        {
            id: "shapes" as const,
            label: "Shapes",
            icon: Shapes,
        },
        {
            id: "draw" as const,
            label: "Draw",
            icon: PenTool,
        },
        {
            id: "ai" as const,
            label: "AI",
            icon: Wand2,
        },
    ];

    return (
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4">
            {tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;

                return (
                    <button
                        key={tool.id}
                        onClick={() => onChangeActiveTool(tool.id)}
                        className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg transition-all duration-200 cursor-pointer group relative ${isActive
                            ? "bg-blue-100 text-blue-600"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                        title={tool.label}
                    >
                        <Icon size={24} />
                        <span className="absolute left-20 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {tool.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
