"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shared/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const carouselImages = [
  'https://res.cloudinary.com/dm1wqczhm/image/upload/w_1200,q_80,c_limit/v1774876250/homepage-3-b5afe1433bf414d14c788e2a128a211f_1_nwmcg3.jpg',
  'https://res.cloudinary.com/dm1wqczhm/image/upload/w_1200,q_80,c_limit/v1774875809/banner-3-b11fbb0d4d4b99ee571bfaf6e54759e8_lrrruw.png',
];

export const Hero = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false })
  );

  return (
    <div className="max-w-6xl mx-auto px-4 my-4 lg:my-6">
      {/* Grid: gap-2 trên mobile giúp khoảng cách khít hơn, xl:gap-3 trên desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 md:gap-3">

        {/* --- MAIN CAROUSEL --- */}
        <div className="xl:col-span-2">
          <Carousel
            className="w-full"
            plugins={[plugin.current]}
            opts={{ align: "start", loop: true }}
          >
            <CarouselContent>
              {carouselImages.map((src, i) => (
                <CarouselItem key={i} className="pl-2 md:pl-4">
                  {/* FIX BO GÓC: isolate giúp clip ảnh chuẩn hơn khi hover */}
                  <div className="relative w-full h-[180px] sm:h-[240px] md:h-[280px] xl:h-[290px] rounded-xl lg:rounded-2xl overflow-hidden shadow-sm isolate">
                    <Image
                      src={src}
                      fill
                      alt={`carousel ${i + 1}`}
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      priority={i === 0}
                      fetchPriority={i === 0 ? 'high' : 'low'}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 66vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* --- PRODUCT CAROUSEL --- */}
        <div className="w-full h-[180px] sm:h-[240px] md:h-[280px] xl:h-[290px]">
          <Carousel className="w-full h-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="h-full">
              {[
                { id: 1, handle: 'custom-tshirt-1', image: 'https://res.cloudinary.com/dm1wqczhm/image/upload/v1774876745/hog_p3gudm.png', title: 'Personalized presents that make memories' },
                { id: 2, handle: 'custom-mug-1', image: 'https://placehold.co/290x290/ff7a00/white?text=Product+2', title: 'Premium custom products for you' },
                { id: 3, handle: 'custom-hoodie-1', image: 'https://placehold.co/290x290/5542be/white?text=Product+3', title: 'Unique gifts that stand out' },
                { id: 4, handle: 'custom-poster-1', image: 'https://placehold.co/290x290/ffd700/white?text=Product+4', title: 'Create your own masterpiece' },
              ].map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full">
                  <Link href={`/product/${product.handle}`} className="group block h-full">
                    <div className="shadow-sm rounded-xl lg:rounded-2xl overflow-hidden flex items-center justify-between gap-2 xl:relative h-full cursor-pointer bg-white border border-gray-100 xl:border-none">

                      {/* Ảnh: Trái trên mobile, Nền trên desktop */}
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 xl:w-full xl:h-full overflow-hidden shrink-0">
                        <Image
                          src={product.image}
                          fill
                          alt={product.title}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 96px, (max-width: 1280px) 128px, 100vw"
                        />
                      </div>

                      {/* Nội dung: Phải trên mobile, Overlay trên desktop */}
                      <div className="flex-1 p-3 xl:absolute xl:inset-0 xl:p-0 xl:bg-gradient-to-t xl:from-black/70 xl:to-transparent xl:flex xl:flex-col xl:justify-end">
                        <div className="xl:p-4">
                          {/* Badge */}
                          <div className="flex items-center text-[10px] md:text-xs gap-1 mb-1 bg-orange-100 text-orange-500 p-1 px-2 rounded-full max-w-fit xl:backdrop-blur-sm xl:bg-white/20 xl:text-yellow-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span className="truncate  font-Inter">Featured</span>
                          </div>
                          {/* Title */}
                          <p className="font-semibold font-Inter text-gray-800 text-sm md:text-base xl:text-white leading-tight line-clamp-2">
                            {product.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

      </div>
    </div>
  );
};