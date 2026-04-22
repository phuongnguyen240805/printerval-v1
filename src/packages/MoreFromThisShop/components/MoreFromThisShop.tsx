// components/MoreFromThisShop.tsx
"use client";

import { useMoreFromThisShop } from "../hook/useMoreFromThisShop";
import ProductGrid from "@/packages/YouMightLoveThese/components/ProductGrid";
import { Button } from "@/shared/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import { MOCK_SELLERS } from "@/lib/mockProduct";


interface Props {
    currentProduct: any;
    shopId: string;
    shopName: string;
    limit?: number;
    seller: {
        id: string;
        name: string;
    };
}

export default function MoreFromThisShop({
    currentProduct,
    shopName,
    shopId,
    limit = 4,
    seller,
}: Props) {

    const { products, sellerId } = useMoreFromThisShop(currentProduct.id, limit);

    // Lấy seller info từ MOCK_SELLERS
    const sellerInfo = MOCK_SELLERS.find(s => s.id === sellerId) || {
        id: sellerId,
        name: shopName,
        avatar: `https://i.pravatar.cc/150?u=${shopName}`,
        followerCount: 0,
        favoriteCount: 0,
        rating: 4.5,
    };

    const productsWithPrice = products.map(p => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        thumbnail: p.thumbnail,
        price: p.variants?.[0]?.calculated_price?.calculated_amount || 0,
        originalPrice: p.variants?.[0]?.calculated_price?.original_amount,
    }));

    if (productsWithPrice.length === 0) return null;

    return (
        <div className="mt-12 bg-[#fffdf7] rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* ── SELLER INFO (Left Sidebar) ── */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 sticky top-52 space-y-4">
                        {/* Seller Avatar/Logo */}
                        <div className="flex items-center gap-3">
                            <Image
                                src={sellerInfo.avatar}
                                alt={sellerInfo.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <p className="text-xs text-gray-600">Designed and sold by</p>
                                <p className="font-bold text-sm">{sellerInfo.name}</p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg underline">{sellerInfo.rating}</span>
                                <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                            </div>
                            <div className="space-y-1 text-sm">
                                <div className="flex gap-2">
                                    <span className="font-bold underline">{sellerInfo.followerCount}</span>
                                    <span className="text-gray-600">Follower</span>
                                </div>
                                <div className="flex gap-2">
                                    <Heart className="w-4 h-4" />
                                    <span className="font-bold underline">{sellerInfo.favoriteCount}</span>
                                    <span className="text-gray-600">Favorited</span>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-2 pt-2">
                            <Button className="w-full bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 text-sm h-10">
                                📧 Submit a ticket
                            </Button>
                            <Button className="w-full bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 text-sm h-10 flex items-center justify-center gap-2">
                                <Heart className="w-4 h-4" />
                                Follow
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── PRODUCTS GRID (Right Side) ── */}
                <div className="md:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">
                            More {sellerInfo.name}'s products
                        </h2>
                        <a href={`/shops/${sellerInfo.name}`} className="text-orange-600 font-medium flex items-center gap-1 hover:underline text-sm">
                            See all items →
                        </a>
                    </div>
                    <ProductGrid products={productsWithPrice} title="" />
                </div>
            </div>
        </div>
    );
}

