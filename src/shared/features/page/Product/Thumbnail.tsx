// "use client";
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shared/ui/carousel"
// import Image from "next/image"
// import { useState, useEffect, useRef } from "react"
// import { createPortal } from "react-dom"
// import type { CarouselApi } from "@/shared/ui/carousel"
// import { CustomizationCanvasRenderer } from "@/packages/customization"
// import { Sparkles } from "lucide-react"
// import { VirtualTryOnModal } from "@/packages/tryon";

// const Thumbnail = ({ product, customDesign, customTemplate, customElements }: { product: any; customDesign?: any; customTemplate?: any; customElements?: any[] }) => {
//     const [activeIndex, setActiveIndex] = useState(0)
//     const [mainApi, setMainApi] = useState<CarouselApi>()
//     const [thumbApi, setThumbApi] = useState<CarouselApi>()
//     const [showTryOn, setShowTryOn] = useState(false)
//     const svgContainerRef = useRef<HTMLDivElement>(null)

//     // Thêm state mounted để tránh lỗi Hydration của Next.js khi dùng Portal
//     const [mounted, setMounted] = useState(false)

//     useEffect(() => {
//         setMounted(true)
//     }, [])

//     // Render customization preview khi có customDesign
//     useEffect(() => {
//         if (customDesign && customTemplate && customElements && customElements.length > 0 && svgContainerRef.current) {
//             try {
//                 console.log('[Thumbnail] Rendering customization with elements:', customElements.map(el => ({ id: el.element_id, type: el.type, text: el.config?.text })));

//                 // Use template dimensions for proper SVG scaling
//                 const renderer = new CustomizationCanvasRenderer(
//                     customTemplate.canvas_width || 800,
//                     customTemplate.canvas_height || 600
//                 )

//                 const svgHtml = renderer.renderSVG(customElements);

//                 if (svgContainerRef.current) {
//                     svgContainerRef.current.innerHTML = svgHtml;

//                     const svgElement = svgContainerRef.current.querySelector('svg');
//                     if (svgElement) {
//                         svgElement.setAttribute('style', `
//                             width: 100% !important;
//                             height: 100% !important;
//                             background: transparent !important;
//                             position: absolute;
//                             top: 0;
//                             left: 0;
//                         `);
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error rendering customization preview:', error)
//             }
//         }
//     }, [customDesign, customTemplate, customElements])

//     // Đồng bộ activeIndex khi carousel chính thay đổi
//     useEffect(() => {
//         if (!mainApi) return

//         const onSelect = () => {
//             const currentIndex = mainApi.selectedScrollSnap()
//             setActiveIndex(currentIndex)
//         }

//         mainApi.on("select", onSelect)

//         return () => {
//             mainApi.off("select", onSelect)
//         }
//     }, [mainApi])

//     // Scroll thumbnail carousel khi activeIndex thay đổi
//     useEffect(() => {
//         if (!thumbApi) return
//         thumbApi.scrollTo(activeIndex)
//     }, [activeIndex, thumbApi])

//     const handleThumbnailClick = (idx: number) => {
//         setActiveIndex(idx)
//         mainApi?.scrollTo(idx)
//     }

//     return (
//         <div className="flex sm:gap-3 items-stretch flex-col lg:flex-row-reverse p-2">
//             {/* Carousel chính */}
//             <Carousel
//                 className="relative w-full h-full"
//                 opts={{ loop: false }}
//                 setApi={setMainApi}
//             >
//                 <CarouselContent >
//                     {product?.images?.map((item: any, idx: number) => (
//                         <CarouselItem key={idx} className="px-2 lg:pl-4">
//                             <div className="relative w-full h-[300px] lg:h-[500px]">
//                                 {/* Ảnh sản phẩm gốc */}
//                                 <Image
//                                     src={item.url}
//                                     width={400}
//                                     height={500}
//                                     alt={`Product image ${idx + 1}`}
//                                     className="rounded-lg w-full h-full object-cover"
//                                     priority
//                                     loading="eager"
//                                 />

//                                 {/* TRY ON Button - Bottom Left Corner */}
//                                 <button
//                                     onClick={() => setShowTryOn(true)}
//                                     className="absolute bottom-4 left-4 bg-white hover:bg-gray-50 text-purple-600 font-semibold py-2 px-4 rounded-full shadow-lg flex items-center gap-2 transition-all hover:shadow-xl z-20"
//                                 >
//                                     <Sparkles size={18} />
//                                     TRY ON
//                                 </button>

//                                 {/* Customization preview (chồng lên ảnh) */}
//                                 {customDesign && customElements && customElements.length > 0 && (
//                                     <div
//                                         ref={svgContainerRef}
//                                         className="absolute inset-0 rounded-lg"
//                                         style={{
//                                             zIndex: 10,
//                                             overflow: 'hidden',
//                                             background: 'transparent'
//                                         }}
//                                     />
//                                 )}
//                             </div>
//                         </CarouselItem>
//                     ))}
//                 </CarouselContent>
//             </Carousel>

//             <div className="flex bg-[#ff4e00] md:hidden">
//                 <Image src={'/assets/early-bird.webp'} width={64} height={64} alt="Early Bird" className="bg-[#fd0] skew-x-12 relative -left-1.5" />
//                 <div className="flex gap-4 items-center justify-center px-2 text-white text-xs">
//                     <div className="flex gap-2 items-center">
//                         <Image src={'/assets/verified_6764458.png'} width={20} height={20} alt="Fire Icon" />
//                         <span>Fast delivery</span>
//                     </div>
//                     <div className="flex gap-2 items-center">
//                         <Image src={'/assets/verified_6764458.png'} width={20} height={20} alt="Fire Icon" />
//                         <span>$5.00 credit for late delivery</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Thumbnail vertical */}
//             <Carousel
//                 opts={{ align: "start", startIndex: activeIndex }}
//                 orientation="vertical"
//                 className="hidden xl:block w-16 xl:w-40 oveflow-hidden"
//                 setApi={setThumbApi}
//             >
//                 <CarouselContent className="gap-2 h-[400px] sm:h-[500px] lg:h-[680px]">
//                     {product?.images?.map((item: any, idx: number) => (
//                         <CarouselItem
//                             key={idx}
//                             className={`basis-1/4 cursor-pointer`}
//                             onClick={() => handleThumbnailClick(idx)}
//                         >
//                            <Image
//                             src={item.url}
//                             width={400}
//                             height={400}
//                             alt={`Thumbnail ${idx + 1}`}
//                             className="rounded-lg w-full h-[150px] lg:max-h-[400px] object-cover"
//                         />
//                         </CarouselItem>
//                     ))}
//                 </CarouselContent>
//             </Carousel>

//             {/* Virtual Try On Modal sử dụng Portal để nổi lên trên cùng */}
//             {showTryOn && mounted && createPortal(
//                 <div className="fixed inset-0 bg-black/10 flex items-center justify-center " style={{ zIndex: 999999 }}>
//                     {/* Bấm vào nền đen bên ngoài để đóng modal */}
//                     <div className="absolute inset-0" onClick={() => setShowTryOn(false)}></div>

//                     <div className="max-h-[90vh] overflow-y-auto relative w-full rounded-xl shadow-2xl" style={{ zIndex: 1000000 }}>
//                         <VirtualTryOnModal onClose={() => setShowTryOn(false)} />
//                     </div>
//                 </div>,
//                 document.body
//             )}
//         </div>
//     )
// }

// export default Thumbnail
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import NextImage from "next/image";
import Script from "next/script";
import { Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";
import { VirtualTryOnModal } from "@/packages/tryon";
import { createPortal } from "react-dom";

interface Spot {
    id: string;
    name: string;
    url: string;
    panoramaUrl: string;
    thumbnailUrl?: string; // ảnh thumbnail sidebar trái
    floorPlanX: number;
    floorPlanY: number;
}

interface VirtualTourProps {
    spots: Spot[];
    floorPlanImage: string;
    floorPlan3DImage?: string;
    customDesign?: any;
    customTemplate?: any;
    customElements?: any[];
}

export default function VirtualTour({
    spots,
    floorPlanImage,
    floorPlan3DImage,
    customDesign,
    customTemplate,
    customElements,
}: VirtualTourProps) {
    const [activeSpotId, setActiveSpotId] = useState("");
    const [showTryOn, setShowTryOn] = useState(false);
    const [showFloorModal, setShowFloorModal] = useState(false);
    const [floorModalTab, setFloorModalTab] = useState<"floorplan" | "3d">("floorplan");
    const [pannellumLoaded, setPannellumLoaded] = useState(false);
    const [viewerReady, setViewerReady] = useState(false);

    const panoramaRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);
    const initDoneRef = useRef(false);

    // Init activeSpotId
    useEffect(() => {
        if (spots?.length && !activeSpotId) {
            setActiveSpotId(spots[0].id);
        }
    }, [spots]);

    const currentSpot = spots?.find(s => s.id === activeSpotId);

    // Load Pannellum script
    useEffect(() => {
        if (typeof window === "undefined") return;
        if ((window as any).pannellum) {
            setPannellumLoaded(true);
            return;
        }
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
        script.async = true;
        script.onload = () => setPannellumLoaded(true);
        document.head.appendChild(script);
    }, []);

    // Init Pannellum — chỉ 1 lần sau khi cả pannellumLoaded và DOM ref ready
    const initViewer = useCallback(() => {
        if (!pannellumLoaded || !panoramaRef.current || !spots?.length || initDoneRef.current) return;
        if (viewerRef.current) {
            viewerRef.current.destroy();
            viewerRef.current = null;
        }

        const firstId = activeSpotId || spots[0].id;
        const config: any = {
            default: {
                firstScene: firstId,
                sceneFadeDuration: 800,
            },
            scenes: {},
        };

        spots.forEach(spot => {
            config.scenes[spot.id] = {
                type: "equirectangular",
                panorama: spot.panoramaUrl,
                title: spot.name,
                hfov: 110,
                autoLoad: true,
                autoRotate: -1.5,
                compass: false,
                mouseZoom: true,
                draggable: true,
            };
        });

        try {
            const viewer = (window as any).pannellum.viewer(panoramaRef.current, config);
            viewerRef.current = viewer;
            initDoneRef.current = true;

            viewer.on("scenechange", (id: string) => setActiveSpotId(id));
            viewer.on("load", () => setViewerReady(true));
        } catch (e) {
            console.error("Pannellum init error:", e);
        }
    }, [pannellumLoaded, spots, activeSpotId]);

    useEffect(() => {
        // Delay nhỏ để đảm bảo DOM đã mount
        const timer = setTimeout(initViewer, 100);
        return () => clearTimeout(timer);
    }, [initViewer]);

    // Cleanup khi unmount
    useEffect(() => {
        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
                initDoneRef.current = false;
            }
        };
    }, []);

    const switchSpot = (id: string) => {
        if (viewerRef.current) {
            viewerRef.current.loadScene(id);
        }
        setActiveSpotId(id);
    };

    const handleFloorSpotClick = (id: string) => {
        switchSpot(id);
        setShowFloorModal(false);
    };

    return (
        <>
            {/* Pannellum CSS */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
            />

            <div className="flex w-full h-screen bg-black overflow-hidden">

                {/* ===== LEFT SIDEBAR — Thumbnail list ===== */}
                <div className="flex flex-col w-[200px] min-w-[200px] bg-zinc-950 border-r border-zinc-800 overflow-y-auto">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-zinc-800">
                        <p className="text-zinc-400 text-xs font-medium tracking-wider uppercase">Danh sách cảnh</p>
                    </div>

                    {spots?.map(spot => (
                        <button
                            key={spot.id}
                            onClick={() => switchSpot(spot.id)}
                            className={`relative flex flex-col text-left transition-all ${activeSpotId === spot.id
                                ? "ring-2 ring-inset ring-purple-500 bg-zinc-900"
                                : "hover:bg-zinc-900"
                                }`}
                        >
                            {/* Thumbnail */}
                            <div className="relative w-full aspect-[4/3] bg-zinc-800 overflow-hidden">
                                {spot.url ? (
                                    <NextImage
                                        src={spot.url}
                                        fill
                                        alt={spot.name}
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                                        <span className="text-zinc-600 text-xs">Không có ảnh</span>
                                    </div>
                                )}
                                {/* Active overlay */}
                                {activeSpotId === spot.id && (
                                    <div className="absolute inset-0 bg-purple-600/20" />
                                )}
                            </div>
                            {/* Room name */}
                            <div className="px-3 py-2">
                                <p className={`text-xs font-medium truncate ${activeSpotId === spot.id ? "text-purple-400" : "text-zinc-300"
                                    }`}>
                                    {spot.name}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* ===== MAIN PANORAMA AREA ===== */}
                <div className="relative flex-1 bg-black">

                    {/* Pannellum container — phải full width/height tuyệt đối */}
                    <div
                        ref={panoramaRef}
                        className="absolute inset-0"
                        style={{ width: "100%", height: "100%" }}
                    />

                    {/* Mini Floor Plan — góc trên trái, click mở modal */}
                    {currentSpot && (
                        <button
                            onClick={() => setShowFloorModal(true)}
                            className="absolute top-4 left-4 z-50 bg-black/80 p-2 rounded-xl border border-white/20 hover:border-purple-400 transition-all group shadow-xl"
                            title="Sơ đồ tầng / Mô hình 3D"
                        >
                            <div className="relative w-[72px] h-[72px] rounded-lg overflow-hidden">
                                <NextImage
                                    src={floorPlanImage}
                                    fill
                                    alt="mini map"
                                    className="object-contain"
                                />
                                {/* Chấm đỏ vị trí hiện tại */}
                                <div
                                    className="absolute z-10 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"
                                    style={{
                                        left: `${currentSpot.floorPlanX}%`,
                                        top: `${currentSpot.floorPlanY}%`,
                                        transform: "translate(-50%, -50%)",
                                        boxShadow: "0 0 0 4px rgba(239,68,68,0.3)",
                                    }}
                                />
                            </div>
                            {/* Label dưới */}
                            <p className="mt-1 text-[10px] text-zinc-400 text-center group-hover:text-white transition-colors">
                                Sơ đồ tầng
                            </p>
                        </button>
                    )}

                    {/* Virtual Try On button */}
                    <button
                        onClick={() => setShowTryOn(true)}
                        className="absolute bottom-6 left-6 z-50 bg-white text-purple-600 px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-2xl hover:bg-purple-50 transition-all hover:scale-105 active:scale-95"
                    >
                        <Sparkles size={18} />
                        THỬ ĐỒ ẢO
                    </button>

                    {/* Room tabs bottom bar */}
                    <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 pb-4 px-4">
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {spots?.map(spot => (
                                <button
                                    key={spot.id}
                                    onClick={() => switchSpot(spot.id)}
                                    className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all border ${activeSpotId === spot.id
                                        ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/50"
                                        : "bg-black/60 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
                                        }`}
                                >
                                    {spot.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Floor Plan Modal ===== */}
            {showFloorModal && createPortal(
                <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/85 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={() => setShowFloorModal(false)} />
                    <div className="relative z-10 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-700 w-full max-w-xl mx-4 overflow-hidden">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                            <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
                                <button
                                    onClick={() => setFloorModalTab("floorplan")}
                                    className={`px-5 py-1.5 rounded-md text-sm font-medium transition ${floorModalTab === "floorplan" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                                        }`}
                                >
                                    Sơ đồ tầng
                                </button>
                                <button
                                    onClick={() => setFloorModalTab("3d")}
                                    className={`px-5 py-1.5 rounded-md text-sm font-medium transition ${floorModalTab === "3d" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                                        }`}
                                >
                                    Mô hình 3D
                                </button>
                            </div>
                            <button
                                onClick={() => setShowFloorModal(false)}
                                className="text-zinc-500 hover:text-white transition p-1.5 rounded-lg hover:bg-zinc-800"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5">
                            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-950">
                                <NextImage
                                    src={floorModalTab === "3d" && floorPlan3DImage ? floorPlan3DImage : floorPlanImage}
                                    fill
                                    alt={floorModalTab === "3d" ? "3D Model" : "Floor Plan"}
                                    className="object-contain"
                                />

                                {/* Hotspot dots */}
                                {spots?.map(spot => (
                                    <button
                                        key={spot.id}
                                        onClick={() => handleFloorSpotClick(spot.id)}
                                        title={spot.name}
                                        style={{
                                            position: "absolute",
                                            left: `${spot.floorPlanX}%`,
                                            top: `${spot.floorPlanY}%`,
                                            transform: "translate(-50%, -50%)",
                                        }}
                                        className="group flex flex-col items-center z-10"
                                    >
                                        <span className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow-lg transition-transform group-hover:scale-125 ${spot.id === activeSpotId ? "bg-red-500 ring-4 ring-red-500/30" : "bg-purple-500 ring-4 ring-purple-500/20"
                                            }`}>
                                            <span className="w-2 h-2 bg-white rounded-full" />
                                        </span>
                                        <span className="mt-1.5 px-2 py-0.5 bg-black/90 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                                            {spot.name}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Room list bên dưới modal */}
                            <div className="flex gap-2 mt-3 flex-wrap">
                                {spots?.map(spot => (
                                    <button
                                        key={spot.id}
                                        onClick={() => handleFloorSpotClick(spot.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${spot.id === activeSpotId
                                            ? "bg-purple-600 text-white"
                                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                            }`}
                                    >
                                        {spot.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Try On Modal */}
            {showTryOn && createPortal(
                <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center">
                    <div className="absolute inset-0" onClick={() => setShowTryOn(false)} />
                    <VirtualTryOnModal onClose={() => setShowTryOn(false)} />
                </div>,
                document.body
            )}
        </>
    );
}