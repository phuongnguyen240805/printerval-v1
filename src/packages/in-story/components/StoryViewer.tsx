"use client";
import { useEffect, useRef, useState } from "react";
import { FiX, FiVolume2, FiVolumeX, FiShoppingBag, FiPlay } from "react-icons/fi";
import { Story } from "../hook/useStoryData";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Props {
  stories: Story[];
  initialIndex: number;
  onClose: (lastViewedIndex: number) => void;
}

export function StoryViewer({ stories, initialIndex, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const router = useRouter();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    setProgress(0); 
    setIsPlaying(true); 
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIndex) {
        vid.currentTime = 0;
        vid.play().catch(e => console.log("Autoplay prevented:", e));
      } else {
        vid.pause();
      }
    });
  }, [currentIndex]);

  const handleTimeUpdate = () => {
    const vid = videoRefs.current[currentIndex];
    if (vid && vid.duration) setProgress((vid.currentTime / vid.duration) * 100);
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex(prev => prev + 1);
    else onClose(currentIndex); 
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const togglePlayPause = () => {
    const vid = videoRefs.current[currentIndex];
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const handleBuyNow = () => {
    onClose(currentIndex);
    // Nhảy trang dựa vào product.handle trong Mock Data
    router.push(`/product/${currentStory.product.handle}`);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex justify-center items-center">
      
      <div className="absolute top-6 right-4 z-50 flex gap-3 pointer-events-auto">
        <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition flex-shrink-0">
          {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
        </button>
        <button onClick={() => onClose(currentIndex)} className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition flex-shrink-0">
          <FiX size={20} />
        </button>
      </div>

      <div className="relative w-full h-full max-w-[400px] bg-black overflow-hidden sm:rounded-2xl sm:h-[90vh] shadow-2xl">
        
        {/* Thanh Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/20 z-40 flex gap-1 px-1 pt-2">
          {stories.map((_, idx) => (
            <div key={idx} className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        <video
          ref={el => { videoRefs.current[currentIndex] = el; }}
          src={currentStory.videoUrl}
          className="w-full h-full object-cover"
          playsInline
          muted={isMuted}
          onEnded={handleNext}
          onTimeUpdate={handleTimeUpdate}
        />

        {/* 3 Vùng Bấm Tiktok */}
        <div className="absolute inset-0 flex z-20">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-1/3 h-full cursor-pointer" onClick={togglePlayPause} />
          <div className="w-1/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {!isPlaying && (
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-30">
            <div className="bg-black/50 p-4 rounded-full backdrop-blur-sm text-white drop-shadow-lg transform scale-110">
              <FiPlay size={40} className="ml-1" />
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full p-4 pb-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-40">
          <div className="flex items-end justify-between gap-4 pointer-events-auto">
            <div className="flex flex-col text-white drop-shadow-md">
              <span className="text-[10px] font-Inter tracking-wider bg-white/20 backdrop-blur-md w-fit px-2 py-1 rounded mb-2">
                Nổi bật
              </span>
              <h3 className="font-Inter text-lg line-clamp-2">{currentStory.product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-Inter text-orange-400">${currentStory.product.price.toFixed(2)}</span>
                {currentStory.product.originalPrice && (
                  <span className="text-sm line-through text-gray-300">${currentStory.product.originalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>

            <button onClick={handleBuyNow} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 flex-shrink-0">
              <Image src={currentStory.product.thumbnail_logo} alt="Logo" width={20} height={20} className="rounded-full flex-shrink-0 border border-white/30" />
              <FiShoppingBag /> Mua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

