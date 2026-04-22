'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import CTACard from '@/components/blog/cta-card';

interface SlideShowSectionProps {
  // công thêm phần này để phù hợp làm 1 cái sile tái sử dụng
  title: string;
  slides: typeof import('@/components/blog/data/seo-slides-show-data').default;
}

const SeoSlideShow = ({ title, slides }: SlideShowSectionProps) => {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDelta = useRef<number>(0);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  // Ensure useEffect is always called and handle empty slides inside it
  useEffect(() => {
    // Check if slides are empty and exit early from the effect
    if (!slides || slides.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount or slides change
  }, [slides]); // Dependency on the entire slides array

  // handlers for touch swipe (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchDelta.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDelta.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDelta.current) > 60) {
      if (touchDelta.current < 0) next();
      else prev();
    }
    touchStartX.current = null;
    touchDelta.current = 0;
  };

  if (!slides || slides.length === 0) return null; // Handle the empty slides case before rendering

  const slide = slides[index];

  return (
    <div className="w-full sm:py-6 lg:py-8">
      {/* Responsive container - giới hạn chiều rộng để không quá to trên màn hình lớn */}
      <div className="w-full max-w-screen-xl mx-auto bg-gradient-to-br from-white via-purple-50 to-white rounded-none sm:rounded-[20px] border-0 sm:border-[3px] sm:border-purple-300 flex items-center justify-center relative overflow-hidden px-2 sm:px-4">
        {/* Control dots (clickable) */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 lg:left-16 flex space-x-2 z-10">
          {slides.map((slideItem, i) => (
            <button
              key={slideItem.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full focus:outline-none ${
                i === index ? 'bg-purple-600' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Content container */}
        <div className="w-full bg-white rounded-none sm:rounded-xl lg:rounded-2xl xl:rounded-3xl relative flex flex-col min-h-[40vh] sm:min-h-[55vh] lg:min-h-[65vh] max-h-[85vh] p-4 sm:p-6 lg:p-8 xl:p-10 shadow-none sm:shadow-lg m-0 sm:m-2 lg:m-4 overflow-hidden">
          {/* Title */}
          <h2 className="text-xl sm:text-4xl lg:text-5xl font-bold text-black text-center mb-6 sm:mb-8 lg:mb-10 font-sans tracking-wide">
            {title}
          </h2>

          {/* Slide section - Mobile: Stack, Desktop: Side by side */}
          <div className="relative flex flex-col lg:flex-row justify-center items-center w-full gap-4 sm:gap-6 lg:gap-8 flex-grow">
            {/* Image container */}
            <div
              className="relative w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[650px] h-[160px] sm:h-[220px] lg:h-[420px] max-h-[70vh] rounded-xl overflow-hidden flex-shrink-0 order-1 lg:order-2"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slide.image}
                    alt="Slide"
                    fill
                    className="object-cover rounded-xl"
                  />
                </motion.div>
              </AnimatePresence>
              {/* Prev / Next buttons (visible on desktop and tablet, small on mobile) */}
              <button
                aria-label="Previous"
                onClick={prev}
                className="hidden sm:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/70 hover:bg-white rounded-full shadow-md z-20"
              >
                ‹
              </button>
              <button
                aria-label="Next"
                onClick={next}
                className="hidden sm:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/70 hover:bg-white rounded-full shadow-md z-20"
              >
                ›
              </button>
            </div>

            {/* Info Card */}
            <div className="w-full max-w-[350px] sm:max-w-[380px] lg:max-w-[420px] bg-white/95 sm:bg-white/85 backdrop-blur-md shadow-md rounded-xl p-4 sm:p-5 lg:p-6 min-h-[180px] sm:min-h-[220px] flex flex-col justify-between border border-purple-300 order-2 lg:order-1 lg:relative lg:left-0 lg:bottom-0 lg:ml-6 z-10">
              <div>
                <div className="bg-purple-600 text-white px-3 py-1 text-xs font-semibold rounded w-fit mb-2 sm:mb-3">
                  {slide.tag}
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 leading-snug text-black">
                  {slide.title}
                </h3>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Image
                    src={slide.author.avatar}
                    alt={slide.author.name}
                    width={28}
                    height={28}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-purple-700 hover:underline cursor-pointer">
                      {slide.author.name}
                    </p>
                    <p className="text-xs text-gray-700">
                      {slide.author.title}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-gray-800 mt-2">
                <span>👁 {slide.stats.views}</span>
                <span>❤️ {slide.stats.likes}</span>
                <span>🔗 {slide.stats.shares}</span>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="w-full mt-4 sm:mt-6 lg:mt-8">
            <CTACard onClickGift={() => console.log('Redirect CTA')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoSlideShow;
