"use client";
import { useState } from "react";
import Image from "next/image";
import FadeIn from "@/shared/components/FadeIn";
import { useStoryData } from "../hook/useStoryData";
import { StoryViewer } from "./StoryViewer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/shared/ui/carousel";

export function StoryList() {
  const { stories } = useStoryData();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();

  if (!stories || stories.length === 0) return null;

  const handleSyncScroll = (lastViewedIndex: number) => {
    setActiveStoryIndex(null);
    if (api) api.scrollTo(lastViewedIndex);
  };

  return (
    <div className="w-full mx-auto max-w-7xl py-8 ">
      {/* Title - Chỉnh lại lề trên mobile */}
      <div className="flex items-center mb-3 ">
        <h2 className="text-lg md:text-2xl font-Inter font-bold italic text-orange-500 uppercase tracking-tight">
          Printerval Story
        </h2>
      </div>

      <div className="">
        <Carousel
          setApi={setApi}
          opts={{ align: "start", dragFree: true }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {stories.map((story, index) => (
              <FadeIn key={story.id} delay={index * 0.05} direction="up">
                <CarouselItem
                  key={story.id}
                  // basis-2/5 giúp hiện ~2.5 item trên mobile, tạo hiệu ứng mời gọi vuốt
                  className="pl-2 basis-[42%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <div
                    onClick={() => setActiveStoryIndex(index)}
                    className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group shadow-md border border-black/5"
                  >
                    <Image
                      src={story.thumbnail_poster}
                      alt={story.product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay tối dần phía dưới để nổi bật chữ */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Thông tin sản phẩm - Tối ưu kích thước cho mobile */}
                    <div className="absolute bottom-0 left-0 w-full p-2 md:p-4 flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-white p-0.5 rounded-lg shrink-0 shadow-lg">
                        <div className="relative w-full h-full overflow-hidden rounded-md bg-gray-100">
                          <Image src={story.product.thumbnail_logo} alt="Logo" fill className="object-cover" />
                        </div>
                      </div>
                      <div className="flex flex-col text-white overflow-hidden text-left leading-tight">
                        <span className="text-[16px] md:text-xs font-semibold font-Inter opacity-80 truncate">
                          {story.product.name}
                        </span>
                        <span className="text-sm md:text-base font-semibold font-Inter">
                          ${story.product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Nút Play trung tâm */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 md:p-3 rounded-full border border-white/30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-6 md:h-6 text-white">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </CarouselItem>
              </FadeIn>
            ))}
          </CarouselContent>

          {/* Ẩn nút điều hướng trên mobile để tránh vướng víu */}
          <CarouselPrevious className="hidden lg:flex absolute -left-4 shadow-xl border-none h-10 w-10" />
          <CarouselNext className="hidden lg:flex absolute -right-4 shadow-xl border-none h-10 w-10" />
        </Carousel>
      </div>

      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={handleSyncScroll}
        />
      )}
    </div>
  );
}

