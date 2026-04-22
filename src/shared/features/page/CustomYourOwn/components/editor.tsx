"use client";

import * as fabric from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";

import { ResponseType } from "../projects/api/use-get-project";

import { ActiveTool } from "../types";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { useEditor } from "../hooks/use-editor";
import { Sidebar } from "./sidebar/sidebar";
import { Toolbar } from "./toolbar";
import { ShapeSidebar } from "./sidebar/shape-sidebar";
import { TextSidebar } from "./sidebar/text-sidebar";
import { ImageSidebar } from "./sidebar/image-sidebar";
import { CategoryImagesSidebar } from "./sidebar/category-images-sidebar";
// import { TemplateSidebar } from "./sidebar/template-sidebar";

interface EditorProps {
    initialData?: Partial<ResponseType>;
    onSave?: (values: { json: string; height: number; width: number }) => void;
};

export const CustomDesigner = ({
    initialData = {
        id: "new",
        json: undefined,
    },
    onSave,
}: EditorProps) => {
    const [activeTool, setActiveTool] = useState<ActiveTool>("select");
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    // Kích thước cố định của Canvas
    const canvasSize = { width: 400, height: 450 };

    const { init, editor } = useEditor({
        defaultState: initialData?.json,
        defaultWidth: 400,
        defaultHeight: 450,
        onSave,
    });

    const onChangeActiveTool = useCallback((tool: ActiveTool) => {
        if (tool === activeTool) {
            setActiveTool("none" as ActiveTool); // Tắt tab
            if (tool === "draw" && editor) {
                editor.disableDrawingMode?.();
            }
            return;
        }

        if (tool === "draw") {
            editor?.enableDrawingMode?.();
        } else if (activeTool === "draw") {
            editor?.disableDrawingMode?.();
        }

        setActiveTool(tool);
    }, [activeTool, editor]);

    // Khởi tạo Fabric
    useEffect(() => {
        if (canvasRef.current) {
            init(canvasRef.current, initialData?.json);
        }
    }, [init, initialData?.json]);



    return (
        <div className="h-full flex flex-col bg-gray-50">
            <Navbar
                id={initialData?.id || "new"}
                editor={editor}
                activeTool={activeTool}
                onChangeActiveTool={onChangeActiveTool}
            />

            <div className="flex-1 flex overflow-hidden min-w-0">
                <Sidebar
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />

                {/* {activeTool === "select" && (
                    <TemplateSidebar
                        editor={editor}
                        activeTool={activeTool}
                        onChangeActiveTool={onChangeActiveTool}
                    />
                )} */}

                {activeTool === "text" && (
                    <TextSidebar
                        editor={editor}
                        activeTool={activeTool}
                        onChangeActiveTool={onChangeActiveTool}
                    />
                )}

                {activeTool === "shapes" && (
                    <ShapeSidebar
                        editor={editor}
                        activeTool={activeTool}
                        onChangeActiveTool={onChangeActiveTool}
                    />
                )}

                {activeTool === "images" && (
                    <ImageSidebar
                        editor={editor}
                        activeTool={activeTool}
                        onChangeActiveTool={onChangeActiveTool}
                    />
                )}

                {activeTool === "category-images" && (
                    <CategoryImagesSidebar
                        editor={editor}
                        activeTool={activeTool}
                        onChangeActiveTool={onChangeActiveTool}
                    />
                )}

                <main className="bg-gray-100 flex-1 overflow-auto relative flex flex-col">
                    <Toolbar
                        editor={editor}
                        activeTool={activeTool}
                        onChangeActiveTool={onChangeActiveTool}
                    />

                    {/* KHU VỰC BỌC NGOÀI (Lấy diện tích trống) */}
                    <div
                        className="flex-1 flex items-center justify-center bg-gray-100 p-8 w-full h-full"
                        ref={containerRef}
                    >
                        {/* KHU VỰC CANVAS (Auto lấy kích thước từ State) */}
                        <div
                            className="bg-white shadow-lg rounded-lg overflow-hidden transition-all m-auto  duration-300"
                            ref={canvasRef}
                            style={{
                                width: canvasSize.width,
                                height: canvasSize.height
                            }}
                        />
                    </div>
                    <Footer editor={editor} />
                </main>
            </div>
        </div>
    );
};