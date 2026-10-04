"use client"; // Chuyển sang Client Component để dùng được Carousel hiệu ứng

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRecentlyViewed, type RecentlyViewedItem } from "@/packages/browsing-history/hooks/useRecentlyViewed";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel";
import { api } from '@/utils/api';

export default function RecentlyViewed() {
  const { getRecentlyViewed } = useRecentlyViewed();
  const [viewed, setViewed] = useState<RecentlyViewedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const loadRecentlyViewed = () => {
      const items = getRecentlyViewed();
      setViewed(items);
      setIsLoading(false);
    };

    loadRecentlyViewed();

    // Lắng nghe event cập nhật từ hook
    const handleUpdate = (event: any) => {
      setViewed(event.detail);
    };

    window.addEventListener('recently-viewed-updated', handleUpdate);
    return () => window.removeEventListener('recently-viewed-updated', handleUpdate);
  }, []);  // getRecentlyViewed

   const [productIds, setProductIds] = useState<string[]>([]);
  
      // 1. Lấy regionID từ local (đã làm ở các bước trước)
      const regionID = typeof window !== 'undefined' ? localStorage.getItem("selected_region") : "";
  
      useEffect(() => {
          // 2. Lấy dữ liệu thô từ LocalStorage
          const rawData = localStorage.getItem("recently_viewed_products");
        
          if (rawData) {
              try {
                  const parsedData = JSON.parse(rawData);
  
                  // 3. LOGIC LỌC: Chuyển mảng Object thành mảng String ID
                  // Giả sử mảng của bạn là [{id: "p1", ...}, {id: "p2", ...}]
                  const ids = parsedData.map((item: any) => item.id);
  
                  setProductIds(ids);
              } catch (e) {
                  console.error("Lỗi parse dữ liệu xem gần đây", e);
              }
          }
      }, []);

      console.log('check productIds: ', productIds, regionID)
  
      // 4. Đưa mảng ID đã lọc vào tRPC
      const { data: recentProducts } = api.medusa.getProductRecent.useQuery(
          {
              ids: productIds,
              regionID: regionID ?? ""
          },
          {
              enabled: productIds.length > 0
          }
      );
  
      console.log('check recent products: ', recentProducts)

  // 2. Trạng thái Loading hoặc không có dữ liệu
  if (isLoading) return <div className="w-full h-20 animate-pulse bg-gray-50 rounded-xl" />;
  if (!viewed || viewed.length === 0) return null;

  return (
    <div className="w-full mx-auto max-w-7xl px-4 md:py-12 border-t border-black/5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[23px] md:text-2xl font-Inter font-semibold text-[#111111] uppercase tracking-tighter">
          Recently Viewed
        </h2>
        <div className="h-px flex-1 bg-black/5 mx-6 hidden md:block"></div>
      </div>

      <Carousel
        opts={{
          align: "start",
          dragFree: true
        }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {viewed.map((item) => {
            // Tính toán giả
            const salePriceNum = parseFloat(item.price) || 0;
            const comparePrice = (item as any).compare_at_price ? parseFloat((item as any).compare_at_price) : null;
            const isDiscounted = comparePrice && comparePrice > salePriceNum;

            return (
              <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                <Link href={item.url} className="group flex flex-col gap-3">
                  {/* Thumbnail Container */}
                  <div className="relative w-full h-[240px] aspect-square overflow-hidden rounded-xl bg-[#F6F7E6] border border-black/5">
                    <Image
                      src={item.image_url || '/placeholder.png'}
                      alt={item.name || 'Product'}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-150"
                    />
                    {/* Overlay mờ khi hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[11px] md:text-xs font-Inter text-gray-600  tracking-widest ">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Luôn hiện giá bán (sale price) */}
                      <span className="text-[16px] font-semibold font-Inter text-black leading-none">
                        ${salePriceNum.toFixed(2)}
                      </span>

                      {/* Chỉ hiện phần giảm giá nếu isDiscounted = true */}
                      {isDiscounted && (
                        <>
                          <span className='text-[14px] font-Inter text-gray-400 line-through'>
                            ${comparePrice!.toFixed(2)}
                          </span>
                          <span data-liquid-badge="" className="bg-[#FFF4E5] text-[#FF8A00] text-[10px] font-semibold font-Inter px-1.5 py-0.5 rounded-full">
                            {Math.round(((comparePrice! - salePriceNum) / comparePrice!) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Nút điều hướng tinh tế (Chỉ hiện trên Desktop) */}
        <CarouselPrevious className="hidden lg:flex -left-4 bg-white border-black/5 hover:bg-[#111111] hover:text-white transition-all shadow-md" />
        <CarouselNext className="hidden lg:flex -right-4 bg-white border-black/5 hover:bg-[#111111] hover:text-white transition-all shadow-md" />
      </Carousel>
    </div>
  );
}

