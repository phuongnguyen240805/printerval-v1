"use client";

import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

import {
    ActiveTool,
    Editor,
} from "../../types";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryImagesSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

interface SubCategory {
    id: string;
    name: string;
    images: Array<{ id: string; url: string; baseImage: string; name: string; price: string }>;
}

interface MainCategory {
    id: string;
    name: string;
    subcategories: SubCategory[];
}


// bảng dữ liệu trê subase
// CREATE TABLE products (
//   id UUID PRIMARY KEY,
//   name VARCHAR NOT NULL,
//   price DECIMAL NOT NULL,
//   thumbnail_url TEXT NOT NULL,      -- Ảnh hiển thị danh mục
//   base_image_url TEXT NOT NULL,     -- Ảnh template để chỉnh sửa
//   category_id UUID REFERENCES categories(id),
//   created_at TIMESTAMP DEFAULT NOW()
// );
// Lấy dữ liệu từ Supabase
// const { data } = await supabase
//   .from('products')
//   .select('*')
//   .eq('category_id', categoryId);




// Main categories with subcategories
const MAIN_CATEGORIES: MainCategory[] = [
    {
        id: "main-1",
        name: "Home & Living",
        subcategories: [
            {
                id: "sub-1-1",
                name: "Home Decor",
                images: [
                    { id: "img-1", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549844/1-5-03c77462932a9d1b2233641a9b02aa22_rzoiwe.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549844/1-5-03c77462932a9d1b2233641a9b02aa22_rzoiwe.jpg", name: "Wall Art", price: "$25.95" },
                    { id: "img-2", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549844/1-4-a523d61bcde36f793c412457319a9a652_qkvnhf.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549844/1-4-a523d61bcde36f793c412457319a9a652_qkvnhf.jpg", name: "Pillow Cover", price: "$18.99" },
                    { id: "img-3", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549844/1-4-a523d61bcde36f793c412457319a9a65_buc1ep.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549844/1-4-a523d61bcde36f793c412457319a9a65_buc1ep.jpg", name: "Table Runner", price: "$14.99" },
                    { id: "img-4", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-4-95ab413062bd5052f452b8b50bc001082_pyiihf.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-4-95ab413062bd5052f452b8b50bc001082_pyiihf.jpg", name: "Throw Blanket", price: "$32.99" },
                ],
            },
            {
                id: "sub-1-2",
                name: "Kitchen",
                images: [
                    { id: "img-5", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-4-95ab413062bd5052f452b8b50bc00108_fqkse0.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-4-95ab413062bd5052f452b8b50bc00108_fqkse0.jpg", name: "Coffee Mug", price: "$22.99" },
                    { id: "img-6", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-4-0b4972d89ec0ee9d5581a977a5971f952_ihw0rm.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-4-0b4972d89ec0ee9d5581a977a5971f952_ihw0rm.jpg", name: "Apron", price: "$28.99" },
                ],
            },
            {
                id: "sub-1-3",
                name: "Lighting",
                images: [
                    { id: "img-7", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-4-0b4972d89ec0ee9d5581a977a5971f95_c1nfo9.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-4-0b4972d89ec0ee9d5581a977a5971f95_c1nfo9.jpg", name: "Desk Lamp", price: "$26.99" },
                    { id: "img-8", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-3dcd11b86d401aeecdf5755be17fa6642_cbrbeb.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-3dcd11b86d401aeecdf5755be17fa6642_cbrbeb.jpg", name: "String Lights", price: "$19.99" },
                ],
            },
        ],
    },
    {
        id: "main-2",
        name: "Fashion",
        subcategories: [
            {
                id: "sub-2-1",
                name: "Men's Clothing",
                images: [
                    { id: "img-9", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-3dcd11b86d401aeecdf5755be17fa664_bwmgkp.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-3dcd11b86d401aeecdf5755be17fa664_bwmgkp.jpg", name: "T-Shirt", price: "$13.99" },
                    { id: "img-10", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-3-d0a0e3e396ae330e45d0fcb3a7dc9dbb2_e1ohm0.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-3-d0a0e3e396ae330e45d0fcb3a7dc9dbb2_e1ohm0.jpg", name: "Polo Shirt", price: "$31.99" },
                ],
            },
            {
                id: "sub-2-2",
                name: "Women's Clothing",
                images: [
                    { id: "img-11", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-3-d0a0e3e396ae330e45d0fcb3a7dc9dbb_pvgytj.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549843/1-3-d0a0e3e396ae330e45d0fcb3a7dc9dbb_pvgytj.jpg", name: "Dress", price: "$16.99" },
                    { id: "img-12", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549839/1-3-6589372fcbee6226232ab57226fc13532_ojtzxn.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549839/1-3-6589372fcbee6226232ab57226fc13532_ojtzxn.jpg", name: "Blouse", price: "$17.99" },
                ],
            },
            {
                id: "sub-2-3",
                name: "Accessories",
                images: [
                    { id: "img-13", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-3-6589372fcbee6226232ab57226fc1353_tzjiix.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-3-6589372fcbee6226232ab57226fc1353_tzjiix.jpg", name: "Hat", price: "$18.99" },
                    { id: "img-14", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-3-6313daceee35d940fed8ea4eba6115932_uf889a.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-3-6313daceee35d940fed8ea4eba6115932_uf889a.jpg", name: "Scarf", price: "$15.99" },
                ],
            },
        ],
    },
    {
        id: "main-3",
        name: "Kids & Babies",
        subcategories: [
            {
                id: "sub-3-1",
                name: "Baby Clothing",
                images: [
                    { id: "img-15", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-3-6313daceee35d940fed8ea4eba611593_kobrht.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-3-6313daceee35d940fed8ea4eba611593_kobrht.jpg", name: "Baby Onesies", price: "$19.99" },
                    { id: "img-16", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-2be68b8604a7db29265697ed8bacf96d2_yqf2da.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-2be68b8604a7db29265697ed8bacf96d2_yqf2da.jpg", name: "Baby T-shirts", price: "$20.99" },
                ],
            },
            {
                id: "sub-3-2",
                name: "Baby Essentials",
                images: [
                    { id: "img-17", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-2be68b8604a7db29265697ed8bacf96d_f1rvie.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-2be68b8604a7db29265697ed8bacf96d_f1rvie.jpg", name: "Baby Blankets", price: "$17.99" },
                    { id: "img-18", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-2-ae193eb82430001ab38746f8223aed22_kns8dp.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-2-ae193eb82430001ab38746f8223aed22_kns8dp.jpg", name: "Bibs", price: "$18.99" },
                ],
            },
            {
                id: "sub-3-3",
                name: "Kids Clothing",
                images: [
                    { id: "img-19", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-2-b2faedb8ef9e84b47d04b7a2d99775202_ftw0mz.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549838/1-2-b2faedb8ef9e84b47d04b7a2d99775202_ftw0mz.jpg", name: "Kids Pullover", price: "$21.99" },
                    { id: "img-20", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549837/1-2-ae193eb82430001ab38746f8223aed222_zzsppw.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549837/1-2-ae193eb82430001ab38746f8223aed222_zzsppw.jpg", name: "Long Sleeve T-Shirts", price: "$12.99" },
                ],
            },
        ],
    },
    {
        id: "main-4",
        name: "Sports & Outdoors",
        subcategories: [
            {
                id: "sub-4-1",
                name: "Sports Equipment",
                images: [
                    { id: "img-21", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549837/1-2-b2faedb8ef9e84b47d04b7a2d9977520_jdreec.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549837/1-2-b2faedb8ef9e84b47d04b7a2d9977520_jdreec.jpg", name: "Sports Bag", price: "$13.99" },
                    { id: "img-22", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549827/1-2-167682513996d527dadcc8b8da84b65e_yqvjnv.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549827/1-2-167682513996d527dadcc8b8da84b65e_yqvjnv.jpg", name: "Water Bottle", price: "$14.99" },
                ],
            },
            {
                id: "sub-4-2",
                name: "Outdoor Gear",
                images: [
                    { id: "img-23", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549826/1-2-167682513996d527dadcc8b8da84b65e2_mw5tvr.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549826/1-2-167682513996d527dadcc8b8da84b65e2_mw5tvr.jpg", name: "Camping Tent", price: "$15.99" },
                    { id: "img-24", url: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549826/1-2-90b1bcd26fa8f0849864461578c56adf2_wibvmt.jpg", baseImage: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774549826/1-2-90b1bcd26fa8f0849864461578c56adf2_wibvmt.jpg", name: "Backpack", price: "$11.99" },
                ],
            },
        ],
    },
];

export const CategoryImagesSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: CategoryImagesSidebarProps) => {
    const [expandedMain, setExpandedMain] = useState<string | null>(
        MAIN_CATEGORIES[0]?.id || null
    );
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
        MAIN_CATEGORIES[0]?.subcategories[0]?.id || null
    );
    const [searchQuery, setSearchQuery] = useState("");

    const onClose = () => {
        onChangeActiveTool("none");
    };

    const toggleMainCategory = (mainId: string) => {
        setExpandedMain(expandedMain === mainId ? null : mainId);
    };

    // Get all main categories for display
    const mainCategoryForDisplay = MAIN_CATEGORIES.find(
        (m) => m.subcategories.some((s) => s.id === selectedSubCategory)
    );

    // Get selected sub category data
    const selectedSubCategoryData = mainCategoryForDisplay?.subcategories.find(
        (s) => s.id === selectedSubCategory
    );

    const filteredImages = selectedSubCategoryData?.images.filter((img) =>
        img.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (activeTool !== "category-images") return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[80%] max-h-[100vh] bg-white rounded-lg shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Choose Images
                        </h2>x
                        <p className="text-sm text-gray-500">
                            Select images by category
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="size-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left: Categories */}
                    <div className="w-56 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                        {MAIN_CATEGORIES.map((mainCat) => (
                            <div key={mainCat.id}>
                                {/* Main Category Header */}
                                <button
                                    onClick={() => toggleMainCategory(mainCat.id)}
                                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition font-semibold text-gray-800 text-sm"
                                >
                                    {mainCat.name}
                                    <ChevronDown
                                        className={cn(
                                            "size-4 transition-transform",
                                            expandedMain === mainCat.id
                                                ? "rotate-180"
                                                : ""
                                        )}
                                    />
                                </button>

                                {/* Sub Categories */}
                                {expandedMain === mainCat.id && (
                                    <div className="bg-white border-t border-gray-200">
                                        {mainCat.subcategories.map((subCat) => (
                                            <button
                                                key={subCat.id}
                                                onClick={() => {
                                                    setSelectedSubCategory(subCat.id);
                                                    setSearchQuery("");
                                                }}
                                                className={cn(
                                                    "w-full px-6 py-2.5 text-left text-sm transition-colors border-l-4 hover:bg-blue-50",
                                                    selectedSubCategory === subCat.id
                                                        ? "bg-blue-50 border-blue-500 text-blue-600 font-medium"
                                                        : "border-transparent text-gray-700 hover:text-gray-900"
                                                )}
                                            >
                                                {subCat.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right: Images */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Search */}
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Find Products"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Image Grid */}
                        <ScrollArea className="flex-1">
                            <div className="p-4">
                                {filteredImages.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">
                                            No images in this category
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-4 gap-3">
                                        {filteredImages.map((image) => (
                                            <div
                                                key={image.id}
                                                className="cursor-pointer"
                                            >
                                                <button
                                                    onClick={() => {
                                                        editor?.addImage(image.baseImage);
                                                        onClose();
                                                    }}
                                                    className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square hover:shadow-lg transition-shadow w-full"
                                                    title={image.name}
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={image.name}
                                                        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                                                </button>
                                                <div className="mt-2">
                                                    <p className="text-xs font-medium text-gray-900 truncate">
                                                        {image.name}
                                                    </p>
                                                    <p className="text-sm font-semibold text-red-500">
                                                        {image.price}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </>
    );
};
