import { useState } from "react";

import { usePaywall } from "../../subscriptions/hooks/use-paywall";

import { ActiveTool, Editor } from "../../types";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";

import { useGenerateImage } from "../../ai/api/use-generate-image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AiSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
};

export const AiSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: AiSidebarProps) => {
    const { shouldBlock, triggerPaywall } = usePaywall();
    const mutation = useGenerateImage();

    const [value, setValue] = useState("");

    const onSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (shouldBlock) {
            triggerPaywall();
            return;
        }

        mutation.mutate({ prompt: value }, {
            onSuccess: ({ data }: any) => {
                editor?.addImage(data);
                setValue("");
            }
        });
    };

    const onClose = () => {
        onChangeActiveTool("select");
    };

    return (
        <ToolSidebarClose onClose={onClose}>
            <ToolSidebarHeader
                title="Generate with AI"
            />
            <ScrollArea>
                <div className="space-y-4 p-4">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <Textarea
                            placeholder="Describe what you want to generate..."
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="min-h-24"
                            disabled={mutation.isPending}
                        />
                        <Button
                            type="submit"
                            disabled={!value || mutation.isPending}
                            className="w-full"
                        >
                            {mutation.isPending ? "Generating..." : "Generate"}
                        </Button>
                    </form>
                </div>
            </ScrollArea>
        </ToolSidebarClose>
    );
};