import Image from "next/image";
import { AlertTriangle, Loader, Crown } from "lucide-react";

import { usePaywall } from "../../subscriptions/hooks/use-paywall";

import {
    ActiveTool,
    Editor,
} from "../../types";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";

import { useGetTemplates } from "../../projects/api/use-get-templates";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
};

export const TemplateSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: TemplateSidebarProps) => {
    const { shouldBlock, triggerPaywall } = usePaywall();

    const { data, isLoading } = useGetTemplates();

    const onClose = () => {
        onChangeActiveTool("none");
    };

    const onClick = async (template: typeof data extends (infer I)[] ? I : any) => {
        if (shouldBlock) {
            triggerPaywall();
            return;
        }

        if (template.json) {
            editor?.loadJson(template.json);
        }
    };

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[10] w-[360px] h-full flex flex-col",
                activeTool === "select" ? "flex" : "hidden", // ✅ hidden = display:none, không chiếm space
            )}
        >
            <ToolSidebarHeader
                title="Templates"
                description="Choose from a variety of templates to get started"
            />
            {isLoading && (
                <div className="flex items-center justify-center flex-1">
                    <Loader className="size-4 text-muted-foreground animate-spin" />
                </div>
            )}
            <ScrollArea className="h">
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        {data && data.map((template: any) => (
                            <button
                                key={template.id}
                                onClick={() => onClick(template)}
                                className="relative w-full group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border h-32 flex flex-col items-center justify-center"
                            >
                                {template.thumbnail ? (
                                    <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                        <span className="text-sm text-gray-600 text-center px-2">{template.name || "Template"}</span>
                                    </div>
                                )}
                                <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 text-center w-full">{template.name || "Template"}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </ScrollArea>
            <ToolSidebarClose onClose={onClose} />
        </aside>
    );
};