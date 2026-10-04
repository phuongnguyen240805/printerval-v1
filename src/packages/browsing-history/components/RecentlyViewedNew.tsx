"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import FadeIn from '@/shared/components/FadeIn';
import { useRecentlyViewed, type RecentlyViewedItem } from "@/packages/browsing-history/hooks/useRecentlyViewed";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/shared/ui/carousel";
import { api } from '@/utils/api';

export default function RecentlyViewedNew() {
    const { getRecentlyViewed } = useRecentlyViewed();
    const [viewed, setViewed] = useState<RecentlyViewedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadRecentlyViewed = () => {
            const items = getRecentlyViewed();
            setViewed(items);
            setIsLoading(false);
        };

        loadRecentlyViewed();

        const handleUpdate = (event: any) => {
            setViewed(event.detail);
        };

        window.addEventListener('recently-viewed-updated', handleUpdate);
        return () => window.removeEventListener('recently-viewed-updated', handleUpdate);
    }, []);

    if (isLoading) return <div className="w-full mx-auto h-[96px] animate-pulse bg-gray-100 rounded-lg" />;
    if (!viewed || viewed.length === 0) return null;

    return (
        <div className='mx-auto w-full max-w-6xl'>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] md:text-[20px] font-semibold font-Inter text-gray-900 tracking-tight">
                    Recently Viewed
                </h2>
            </div>

            <div className="relative">
                <Carousel
                    opts={{
                        align: "start",
                        dragFree: true
                    }}
                    className="w-full group"
                >
                    <CarouselContent className="-ml-3">
                        {viewed.map((item, index) => {
                            // 1. Hàm làm sạch và parse an toàn (loại bỏ $, chữ, khoảng trắng...)
                            const getCleanNumber = (val: any) => {
                                if (!val) return 0;
                                const cleanStr = String(val).replace(/[^\d.]/g, ''); // Chỉ giữ lại số và dấu .
                                return parseFloat(cleanStr) || 0;
                            };

                            // 2. Tính toán giá
                            const salePriceNum = getCleanNumber(item.price);
                            const originalPriceNum = getCleanNumber((item as any).compare_at_price);

                            // 3. Kiểm tra xem có đang giảm giá hay không (giá gốc > giá bán)
                            const isDiscounted = originalPriceNum > salePriceNum;

                            // 4. Tính % giảm giá (nếu có)
                            const discount = isDiscounted
                                ? Math.round(((originalPriceNum - salePriceNum) / originalPriceNum) * 100)
                                : 0;

                            return (
                                <FadeIn key={item.id} delay={index * 0.03} direction="left">
                                    <CarouselItem key={item.id} className="pl-3 basis-auto">
                                        <Link href={item.url} className="block group">
                                            <div data-liquid-card="" className="product-viewed-item bg-[#fafafa] p-2 rounded-xl grid grid-cols-[80px_1fr] gap-3 w-[218px] h-[96px] hover:shadow-md transition-shadow duration-300">

                                                <div className="relative w-[80px] h-[80px] bg-white rounded-md overflow-hidden shrink-0">
                                                    <Image
                                                        src={item.image_url || '/placeholder.png'}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                    />
                                                </div>

                                                <div className="flex flex-col justify-start overflow-hidden">
                                                    <p className="product-viewed-title text-[14px] font-Inter text-[#444] line-clamp-2 leading-[1.3] mb-1 group-hover:text-[#ff6600] transition-colors h-[36px]">
                                                        {item.name}
                                                    </p>

                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        {/* Luôn hiện giá bán (sale price) */}
                                                        <span className="text-[16px] font-semibold font-Inter text-black leading-none">
                                                            ${salePriceNum.toFixed(2)}
                                                        </span>

                                                        {/* Chỉ hiện phần giảm giá nếu isDiscounted = true */}
                                                        {isDiscounted && (
                                                            <>
                                                                <span className='text-[14px] font-Inter text-gray-400 line-through'>
                                                                    ${originalPriceNum.toFixed(2)}
                                                                </span>

                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </Link>
                                    </CarouselItem>
                                </FadeIn>
                            );
                        })}
                    </CarouselContent>

                    {/* Nút điều hướng Carousel (như trong ảnh có mũi tên trái/phải) */}
                    <CarouselPrevious className="hidden md:flex -left-4 bg-white/90 shadow-md border-gray-100 hover:bg-white hover:text-[#ff6600]" />
                    <CarouselNext className="hidden md:flex -right-4 bg-white/90 shadow-md border-gray-100 hover:bg-white hover:text-[#ff6600]" />
                </Carousel>
            </div>
        </div>

    );
}

