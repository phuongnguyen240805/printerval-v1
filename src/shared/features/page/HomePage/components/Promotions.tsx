"use client"
import Link from 'next/link';
import Image from 'next/image';
import FadeIn from '@/shared/components/FadeIn';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/shared/ui/carousel"
import { mockProducts } from '@/lib/mockProduct';
import { api } from '@/utils/api';
import React, { useEffect } from 'react';

export const SaleProduct = ({ TopSale, title }: { TopSale?: any[], title: string }) => {
    const { data: regions } = api.medusa.getRegions.useQuery(undefined, {
        retry: false,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // 2. State để quản lý regionID hiện tại
    const [regionID, setRegionID] = React.useState<string | null>(null);

    useEffect(() => {
        const savedRegion = localStorage.getItem("selected_region");

        if (savedRegion && regions?.some(region => region.id === savedRegion)) {
            setRegionID(savedRegion);
        } else if (regions && regions.length > 0) {
            // Nếu chưa có trong local, lấy cái đầu tiên từ Medusa và lưu lại
            const defaultId = regions[0].id;
            localStorage.setItem("selected_region", defaultId);
            setRegionID(defaultId);
        } else {
            setRegionID(null);
        }
    }, [regions]);

    const {
        data: saleProducts,
        isLoading: isLoadingSale,
        isError
    } = api.medusa.getSaleProducts.useQuery(
        { regionID: regionID ?? "" },
        {
            enabled: !!regionID,
            staleTime: 1000 * 60 * 5,
            retry: false,
            refetchOnWindowFocus: false,
        }
    );

    // ƯU TIÊN: saleProducts từ API -> TopSale từ Prop -> Mock cuối cùng
    const products = saleProducts?.length ? saleProducts : TopSale?.length ? TopSale : mockProducts;
    const countArrays = Array.from({ length: Math.ceil(products.length / 4) }, (_, i) => i);

    return (
        <div className='w-full mx-auto h-full lg:px-2 md:my-10'>
            <div className='bg-[#FE5535] lg:rounded-2xl py-4 px-3 xl:px-10 shadow-sm border border-black/5'>

                {/* Header: tiêu đề + countdown + View all */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className='text-lg sm:text-2xl md:text-3xl font-semibold font-Inter text-white'>
                        Today's Big Deals
                    </h1>

                    {/* Countdown */}
                    <div className="flex items-center gap-1 text-white text-xs font-Inter">
                        <span className="hidden sm:inline">Fresh deals in</span>
                        <span className="bg-black text-white font-semibold text-sm px-2 py-1 rounded">01</span>
                        <span className="font-semibold">:</span>
                        <span className="bg-black text-white font-semibold text-sm px-2 py-1 rounded">42</span>
                        <span className="font-semibold">:</span>
                        <span className="bg-black text-white font-semibold text-sm px-2 py-1 rounded">01</span>
                    </div>
                </div>

                <Carousel opts={{ align: "start" }} className="w-full relative">
                    <CarouselContent className='-ml-2 md:-ml-4'>
                        {countArrays.map((_, groupIndex) => (
                            <CarouselItem key={groupIndex} className="basis-full pl-2 md:pl-4">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5">
                                    {products?.slice(groupIndex * 4, groupIndex * 4 + 4)?.map((product: any, index: any) => {
                                        // Lấy thông tin giá từ biến thể đầu tiên
                                        const priceData = product.variants?.[0]?.calculated_price;

                                        const originalAmount = priceData?.original_amount ? priceData.original_amount : 0;
                                        const calculatedAmount = priceData?.calculated_amount ? priceData.calculated_amount : 0;
                                        const currencySymbol = priceData?.currency_code?.toUpperCase() === "VND" ? "đ" : "$";

                                        const discount = originalAmount > 0
                                            ? Math.round(((originalAmount - calculatedAmount) / originalAmount) * 100)
                                            : 0;

                                        return (
                                            <FadeIn key={product.id || index} delay={index * 0.05} direction="up">
                                                <Link href={`/product/${product.handle}`} className='group bg-white rounded-xl overflow-hidden flex flex-col h-full'>
                                                    {/* Ảnh */}
                                                    <div className="relative w-full aspect-square h-[175px] sm:h-[240px] lg:h-[290px]">
                                                        <Image
                                                            src={product.thumbnail || '/placeholder.png'}
                                                            alt={product.title}
                                                            fill
                                                            className='object-cover transition-transform duration-500 group-hover:scale-110'
                                                        />
                                                    </div>

                                                    <div className='p-3 flex flex-col flex-grow gap-2'>
                                                        <h2 className='text-sm font-semibold font-Inter text-gray-600 line-clamp-2'>
                                                            {product.title}
                                                        </h2>

                                                        <div className='flex flex-wrap items-center gap-2'>
                                                            <span className='text-lg font-bold text-red-600'>
                                                                {currencySymbol}{calculatedAmount.toLocaleString('en-US')}
                                                            </span>
                                                            {discount > 0 && (
                                                                <span className='text-xs text-gray-400 line-through'>
                                                                    {currencySymbol}{originalAmount.toLocaleString('en-US')}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {discount > 0 && (
                                                            <div className="inline-block w-fit bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded">
                                                                {discount}% OFF
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </FadeIn>
                                        );
                                    })}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className='hidden lg:flex -left-5 bg-white border-black/5 hover:bg-[#111111] hover:text-white transition-all shadow-md' />
                    <CarouselNext className='hidden lg:flex -right-5 bg-white border-black/5 hover:bg-[#111111] hover:text-white transition-all shadow-md' />
                </Carousel>
            </div>
        </div>
    )
}
