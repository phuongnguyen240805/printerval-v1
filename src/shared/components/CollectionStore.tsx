import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
const Store = [
    {
        thumbnail: '/assets/collection-store-1.webp',
        name: 'Cozy Home Essentials',
    },
    {
        thumbnail: '/assets/collection-store-2.webp',
        name: 'Gourmet Food & Drink',
    },
    {
        thumbnail: '/assets/collection-store-3.webp',
        name: 'Holiday Decor',
    },
    {
        thumbnail: '/assets/collection-store-3.webp',
        name: 'Holiday Decor',
    },
    {
        thumbnail: '/assets/collection-store-3.webp',
        name: 'Holiday Decor',
    },
]
const CollectStore = () => {
    return (
        <div className="px-2 py-4 w-full bg-[#F3F9FE]rounded-xl">
            <h1 className="text-center font-bold text-md">Collection from the store</h1>
            <div className="lg:hidden">
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                >
                    <CarouselContent className="px-3">
                        {Store.map((item, index) => (
                            <CarouselItem key={index} className="basis-1/4">
                                <div className="px-1">
                                    <Image src={item.thumbnail} width={75} height={75} alt={item.name} className="w-full rounded-3xl" />
                                    <span className="block w-full text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                                        {item.name}
                                    </span>

                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            <div className="hidden lg:grid lg:grid-cols-5">
                {Store.map((item, index) => (
                    <div key={index} className="flex flex-col items-center px-2">
                        <Image src={item.thumbnail} width={75} height={75} alt={item.name} className="w-full rounded-3xl" />
                        <span className="block w-full text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default CollectStore;