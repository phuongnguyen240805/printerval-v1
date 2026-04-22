import React from 'react';
import FadeIn from '@/shared/components/FadeIn';
import { TrendingUp } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/ui/carousel';

const trendingItems = [
  {
    id: 1,
    title: "Hoodie",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    images: [
      { url: "/assets/hoodies.webp", span: "col-span-2 row-span-2" },
      { url: "/assets/hoodies-2.webp", span: "col-span-1 row-span-1" },
      { url: "/assets/hoodies-3.webp", span: "col-span-1 row-span-1" }
    ]
  },
  {
    id: 2,
    title: "Viking",
    color: "bg-gradient-to-br from-red-500 to-red-600",
    images: [
      { url: "/assets/viking-1.webp", span: "col-span-2 row-span-2" },
      { url: "/assets/vikings.webp", span: "col-span-1 row-span-1" },
      { url: "/assets/viking-2.webp", span: "col-span-1 row-span-1" }
    ]
  },
  {
    id: 3,
    title: "Tattoo",
    color: "bg-gradient-to-br from-yellow-400 to-orange-400",
    images: [
      { url: "/assets/tatoo.webp", span: "col-span-2 row-span-2" },
      { url: "/assets/products/product-7.jpg", span: "col-span-1 row-span-1" },
      { url: "/assets/products/product-8.jpg", span: "col-span-1 row-span-1" }
    ]
  },
  {
    id: 4,
    title: "Personalized",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    images: [
      { url: "/assets/personal.webp", span: "col-span-2 row-span-2" },
      { url: "/assets/products/product-10.jpg", span: "col-span-1 row-span-1" },
      { url: "/assets/products/product-11.jpg", span: "col-span-1 row-span-1" }
    ]
  },
  {
    id: 5,
    title: "Music",
    color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    images: [
      { url: "/assets/music.webp", span: "col-span-2 row-span-2" },
      { url: "/assets/products/product-12.jpg", span: "col-span-1 row-span-1" },
      { url: "/assets/products/product-13.jpg", span: "col-span-1 row-span-1" }
    ]
  },
  {
    id: 6,
    title: "Eagle",
    color: "bg-gradient-to-br from-orange-500 to-amber-500",
    images: [
      { url: "/assets/ealge.webp", span: "col-span-2 row-span-2" },
      { url: "/assets/products/product-14.jpg", span: "col-span-1 row-span-1" },
      { url: "/assets/products/product-15.jpg", span: "col-span-1 row-span-1" }
    ]
  },
  {
    id: 7,
    title: "Veteran",
    color: "bg-gradient-to-br from-red-600 to-blue-600",
    images: [
      { url: "/assets/veteran.webp", span: "col-span-2 row-span-2" },
      { url: "/assets/products/product-16.jpg", span: "col-span-1 row-span-1" },
      { url: "/assets/products/product-17.jpg", span: "col-span-1 row-span-1" }
    ]
  },
  {
    id: 8,
    title: "Mug",
    color: "bg-gradient-to-br from-green-500 to-teal-500",
    images: [
      { url: "/assets/mug.webp", span: "col-span-2 row-span-2" },
      { url: "/assets/products/product-18.jpg", span: "col-span-1 row-span-1" },
      { url: "/assets/products/product-19.jpg", span: "col-span-1 row-span-1" }
    ]
  }
];

export function Trending() {
  return (
    <div className='mx-auto w-full px-2 max-w-7xl py-4 py-8 hidden md:block'>
      <h1 className="text-base sm:text-lg md:text-xl font-bold flex gap-1.5 sm:gap-2 items-center mb-3 sm:mb-4 md:mb-5">
        <TrendingUp className="text-orange-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        🔥 Trending Collection
      </h1>

      <div className="hidden xl:grid xl:grid-cols-4 gap-1.5 sm:gap-2 md:gap-3">
        {trendingItems.map((item, index) => (
          <FadeIn key={item.id} delay={index * 0.05} direction="up">
            <div className="group cursor-pointer">
              <div className={`${item.color} rounded-xl p-1 overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
                <div className="grid grid-cols-3 grid-rows-2 sm:gap-1.5 h-32 sm:h-40 md:h-48">
                  {item.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`${img.span} rounded-lg overflow-hidden bg-white relative`}
                    >
                      <img
                        src={img.url}
                        alt={`${item.title} ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="text-center font-bold text-gray-900 mt-1.5 sm:mt-2 text-xs sm:text-sm">
                {item.title}
              </h3>
            </div>
          </FadeIn>
        ))}
      </div>
      <div className='xl:hidden'>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className='p-4 gap-2'>
            {trendingItems.map((item, index) => (
              <FadeIn key={item.id} delay={index * 0.05} direction="left">
                <CarouselItem className={`${item.color} basis-1/3 group cursor-pointer rounded-xl mx-2 p-1 overflow-hidden shadow-sm`}>
                  <div className="grid grid-cols-3 grid-rows-2 gap-1 w-full h-full">
                    {item.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`${img.span} rounded-lg overflow-hidden bg-white relative group-hover:scale-[1.02] transition-transform`}
                      >
                        <img
                          src={img.url}
                          alt={`${item.title} ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </CarouselItem>
              </FadeIn>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}