import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';

const images = [
  '/assets/products/product-1.jpg',
  '/assets/products/product-2.jpg',
  '/assets/products/product-3.jpg',
  '/assets/products/product-4.jpg',
  '/assets/products/product-5.jpg',
  '/assets/products/product-6.jpg',
  '/assets/products/product-7.jpg',
  '/assets/products/product-8.jpg',
];

const chunk = (arr: string[], size: number) => {
  const result: string[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
};

export const AdsSpace = () => (
  <div data-liquid-card="" className="relative overflow-hidden rounded-[24px]">
    <Image
      src="/assets/pc-back-to-school.jpg"
      alt="Printerval marketplace"
      width={1500}
      height={800}
      className="hidden h-64 w-full object-cover lg:block xl:h-72"
    />

    <div className="relative h-[400px] bg-[url('/assets/spice-up-your-life.webp')] bg-cover bg-no-repeat lg:hidden">
      <Image
        src="/assets/boy-back-to-school.webp"
        alt="Printerval marketplace"
        width={192}
        height={640}
        className="absolute bottom-0 left-0"
      />
    </div>

    <div className="absolute left-[50%] top-[50%] -translate-x-1 -translate-y-1/3 py-8 sm:-translate-x-1/3 sm:-translate-y-1 lg:-translate-x-1/4 lg:-translate-y-8 xl:py-0">
      <p data-liquid-surface="" className="w-36 p-3 text-sm leading-relaxed md:w-[400px] md:text-md">
        Printerval is an online marketplace where people connect to create, sell, buy, and collect unique items. It fosters a community dedicated to supporting independent creators while offering buyers peace of mind.
      </p>
    </div>
  </div>
);

export const AdsFandom = () => {
  const mobileSlides = chunk(images, 6);
  const desktopSlides = chunk(images, 10);

  return (
    <section data-liquid-surface="" className="w-full p-4 sm:p-6 md:p-8" aria-label="Printerval Fandom">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold sm:mb-5 sm:text-lg md:mb-6 md:text-xl lg:mb-8 lg:text-2xl">
        #Printerval Fandom
      </h2>

      <Carousel className="xl:hidden">
        <CarouselContent>
          {mobileSlides.map((group, i) => (
            <CarouselItem key={i} className="basis-full">
              <div className="grid grid-cols-3 grid-rows-2 gap-2 pl-2">
                {group.map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={`Product ${idx + 1}`}
                    className="h-32 w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105 sm:h-64 lg:h-72"
                  />
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Carousel className="hidden xl:block">
        <CarouselContent>
          {desktopSlides.map((group, i) => (
            <CarouselItem key={i} className="basis-full">
              <div className="grid grid-cols-5 grid-rows-2 gap-4">
                {group.map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={`Product ${idx + 1}`}
                    className="h-[250px] w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
                  />
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};
