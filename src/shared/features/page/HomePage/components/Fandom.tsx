"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel";

const FANDOM_DATA = [
  { id: "f1", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", handle: "anytime-fitness-tshirt" },
  { id: "f2", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80", handle: "bonecrusher-skull-hoodie" },
  { id: "f3", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80", handle: "takayasu-akira-tanktop" },
  { id: "f4", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80", handle: "annie-musical-hoodie" },
  { id: "f5", img: "https://images.unsplash.com/photo-1520975954732-57dd22299614?w=600&q=80", handle: "mike-gift-tshirt" },
  { id: "f6", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", handle: "anytime-fitness-tshirt" },
  { id: "f7", img: "https://images.unsplash.com/photo-1556821838-89bd246ac681?w=600&q=80", handle: "bonecrusher-skull-hoodie" },
  { id: "f8", img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80", handle: "takayasu-akira-tanktop" },
  { id: "f9", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", handle: "annie-musical-hoodie" },
  { id: "f10", img: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=80", handle: "mike-gift-tshirt" },
];

export function Fandom() {
  const chunkArray = (arr: any[], size: number) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const chunkedData = chunkArray(FANDOM_DATA, 2);

  return (
    <div className="w-full mx-auto max-w-7xl py-10">
      <div className="flex items-center mb-6  xl:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          #Printerval Fandom
        </h2>
      </div>

      <div className="">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full relative group/carousel" 
        >
          <CarouselContent className="ml-0">
            {chunkedData.map((colItems, colIndex) => (
              <CarouselItem
                key={colIndex}
                className="pl-3 basis-[45%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <div className="flex flex-col gap-3">
                  {colItems.map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.handle}`}
                      // FIX Ở ĐÂY: Thêm 'block' để Link có chiều cao, thêm min-h để chắc chắn nó ko sập
                      className="block relative w-full aspect-square min-h-[150px] rounded-xl overflow-hidden group/item cursor-pointer bg-gray-200"
                    >
                      <Image
                        src={item.img}
                        alt="Fandom Image"
                        fill
                        className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white text-gray-900 font-semibold px-4 py-2 rounded shadow-lg transform translate-y-2 group-hover/item:translate-y-0 transition-all duration-300 text-sm">
                          Shop now
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden lg:flex absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md border-0 w-10 h-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
          <CarouselNext className="hidden lg:flex absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md border-0 w-10 h-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
        </Carousel>
      </div>
    </div>
  );
}