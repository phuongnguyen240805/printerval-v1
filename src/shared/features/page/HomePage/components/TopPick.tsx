"use client"
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import FadeIn from '@/shared/components/FadeIn';
import { Card, CardContent } from "@/shared/ui/card";
import { Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shared/ui/carousel";

export const TopPick = ({ product, title }: { product: any[], title?: string }) => {
  if (!product || product.length === 0) return null;

  // ✅ Chỉ lấy tối đa 7 sản phẩm: 1 lớn + 6 nhỏ
  const featured = product[0];
  const rest = product.slice(1, 7);

  return (
    <div className='mx-auto font-Inter w-full max-w-7xl'>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] md:text-[24px] font-semibold text-gray-990  tracking-tight">
          {title || "Our Top Picks"}
        </h1>
      </div>

      <div className="flex flex-col gap-4 xl:grid xl:grid-cols-5 xl:gap-6">

        {/* Sản phẩm lớn nổi bật - bên trái */}
        <div className="xl:col-span-2">
          <Link href={`/product/${featured.handle}`} className="group block">
            <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-xl">
              <div className="relative h-[450px] w-full overflow-hidden bg-gray-50">
                <Image
                  src={featured.thumbnail}
                  alt={featured.title}
                  fill
                  className="object-contain group-hover:scale-150 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6 bg-white">
                <h3 className=" font-Inter text-lg text-gray-600 font-semibold line-clamp-2 mb-2">
                  {featured.title}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-[20px] font-Inter font-semibold text-gray-900">
                    ${(featured.variants?.[0]?.calculated_price?.calculated_amount / 100).toFixed(2)}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    ${(featured.variants?.[0]?.calculated_price?.original_amount / 100).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* ✅ Grid 2x3 cố định cho 6 sản phẩm còn lại - bên phải */}
        <div className="xl:col-span-3">
          {/* Mobile: Carousel cuộn ngang */}
          <div className="xl:hidden">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="-ml-2">
                {rest.map((item: any, index: number) => (
                  <FadeIn key={index} delay={index * 0.05} direction="up">
                    <CarouselItem key={index} className="pl-2 basis-1/2 sm:basis-1/3">
                      <Link href={`/product/${item.handle}`} className="group block">
                        <Card className="border-none shadow-sm  hover:shadow-md transition-all rounded-xl overflow-hidden">
                          <div className="relative w-full h-[200px] bg-gray-50 overflow-hidden">
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-150 transition-transform duration-500"
                            />
                          </div>
                          <CardContent className="p-3 flex flex-col gap-1">
                            <p className="text-[14px] font-semibold font-Inter text-gray-600 line-clamp-1">
                              {item.title}
                            </p>
                            <span className="text-[16px] font-Inter font-semibold  text-gray-900">
                              ${(item.variants?.[0]?.calculated_price?.calculated_amount / 100).toFixed(2)}
                            </span>
                            <span className="text-[14px] font-Inter text-gray-400 line-through">
                              ${(item.variants?.[0]?.calculated_price?.original_amount / 100).toFixed(2)}
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  </FadeIn>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* ✅ Desktop: Grid 2 hàng x 3 cột cố định */}
          <div className="hidden xl:grid xl:grid-cols-3 xl:grid-rows-2 gap-4">
            {rest.map((item: any, index: number) => (
              <FadeIn key={index} delay={index * 0.05} direction="up">
                <Link key={index} href={`/product/${item.handle}`} className="group block">
                  <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden">
                    <div className="relative w-full h-[200px] bg-gray-50 overflow-hidden">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-150 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-3 flex flex-col gap-1">
                      <p className="text-[14px] font-semibold font-Inter text-gray-600 line-clamp-1">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-Inter font-semibold  text-gray-900">
                          ${(item.variants?.[0]?.calculated_price?.calculated_amount / 100).toFixed(2)}
                        </span>
                        <span className="text-[14px] font-Inter text-gray-400 line-through">
                          ${(item.variants?.[0]?.calculated_price?.original_amount / 100).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
export default TopPick;