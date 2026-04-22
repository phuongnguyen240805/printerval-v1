import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Loader, Upload, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";

import { ActiveTool, Editor } from "../../types";
import { ToolSidebarClose } from "./tool-sidebar-close";

import { useGetImages } from "@/features/images/api/use-get-images";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageSidebar = ({ editor, activeTool, onChangeActiveTool }: ImageSidebarProps) => {
    const { data, isLoading, isError } = useGetImages();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [recentImages, setRecentImages] = useState<Array<{ id: string; url: string; baseImage: string; name: string; price: string }>>([]);

    // Load recent images từ localStorage và listen event
    useEffect(() => {
        const loadRecentImages = () => {
            try {
                const stored = localStorage.getItem("recentUploadedImages");
                if (stored) {
                    setRecentImages(JSON.parse(stored));
                    console.log("✅ Loaded recent images:", stored);
                }
            } catch (error) {
                console.error("❌ Error loading recent images:", error);
            }
        };

        loadRecentImages();

        // Listen vào custom event từ upload
        const handleRecentImagesUpdate = (e: any) => {
            console.log("📢 Event received:", e.detail);
            setRecentImages(e.detail);
        };

        window.addEventListener("recentImagesUpdated", handleRecentImagesUpdate);
        return () => window.removeEventListener("recentImagesUpdated", handleRecentImagesUpdate);
    }, []);

    const onClose = () => {
        onChangeActiveTool("none");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                editor?.addImage(dataUrl);

                // Lưu ảnh vào local storage
                try {
                    const recentImages = JSON.parse(
                        localStorage.getItem("recentUploadedImages") || "[]"
                    ) as Array<{ id: string; url: string; baseImage: string; name: string; price: string }>;

                    const newImage = {
                        id: `uploaded-${Date.now()}`,
                        url: dataUrl,
                        baseImage: dataUrl,
                        name: file.name.replace(/\.[^/.]+$/, ""),
                        price: "Custom"
                    };

                    const updated = [newImage, ...recentImages].slice(0, 10);
                    localStorage.setItem("recentUploadedImages", JSON.stringify(updated));
                    console.log("✅ Saved to localStorage:", updated);

                    // Dispatch event
                    if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent("recentImagesUpdated", { detail: updated }));
                        console.log("✅ Dispatched event: recentImagesUpdated");
                    }
                } catch (error) {
                    console.error("❌ Error saving image:", error);
                }

                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleDeleteImage = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn click event từ button add image

        try {
            const updated = recentImages.filter(img => img.id !== id);
            localStorage.setItem("recentUploadedImages", JSON.stringify(updated));
            setRecentImages(updated);
            console.log("✅ Deleted image:", id, "Remaining:", updated);

            // Dispatch event để sync across components
            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("recentImagesUpdated", { detail: updated }));
            }
        } catch (error) {
            console.error("❌ Error deleting image:", error);
        }
    };

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[10] w-[360px] h-full flex flex-col",
                activeTool === "images" ? "visible" : "hidden"
            )}
        >
            <div className="flex flex-col gap-3 p-4 border-b">
                <div>
                    <h3 className="font-semibold text-sm">Images</h3>
                    <p className="text-xs text-gray-500">Add images to your canvas</p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleUploadClick}
                        onMouseDown={(e) => e.preventDefault()}
                        onTouchStart={(e) => e.preventDefault()}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 active:bg-blue-700 transition cursor-pointer"
                    >
                        <Upload className="size-4" />
                        Upload File
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>
            </div>
            {isLoading && (
                <div className="flex items-center justify-center flex-1">
                    <Loader className="size-4 text-muted-foreground animate-spin" />
                </div>
            )}
            {isError && (
                <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
                    <AlertTriangle className="size-4 text-muted-foreground" />
                    <p className="text-muted-foreground text-xs">Failed to fetch images</p>
                </div>
            )}
            <ScrollArea>
                <div className="p-4">
                    {/* Recent Uploaded Images */}
                    {recentImages.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Your Uploads</h4>
                            <div className="grid grid-cols-2 gap-4 border-b pb-4">
                                {recentImages.map((image) => (
                                    <button
                                        onClick={() => editor?.addImage(image.baseImage)}
                                        key={image.id}
                                        className="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border border-blue-300"
                                        title={image.name}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.name}
                                            className="object-cover w-full h-full"
                                            loading="lazy"
                                        />
                                        <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black/40 flex items-center justify-center transition">
                                            <span className="text-white text-xs">Click to add</span>
                                        </div>
                                        {/* Delete button - only visible on hover */}
                                        <button
                                            onClick={(e) => handleDeleteImage(image.id, e)}
                                            className="opacity-0 group-hover:opacity-100 absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 transition rounded-full"
                                            title="Delete image"
                                        >
                                            <X className="size-3 text-white" />
                                        </button>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* API Images */}
                    <div className="grid grid-cols-2 gap-4">
                        {data &&
                            data.map((image) => {
                                return (
                                    <button
                                        onClick={() => editor?.addImage(image.urls.regular)}
                                        key={image.id}
                                        className="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                                    >
                                        <img
                                            src={image?.urls?.small || image?.urls?.thumb}
                                            alt={image.alt_description || "Image"}
                                            className="object-cover"
                                            loading="lazy"
                                        />
                                        <Link
                                            target="_blank"
                                            href={image.links.html}
                                            className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left"
                                        >
                                            {image.user.name}
                                        </Link>
                                    </button>
                                );
                            })}
                    </div>
                </div>
            </ScrollArea>
            <ToolSidebarClose onClose={onClose} />
        </aside >
    );
};
