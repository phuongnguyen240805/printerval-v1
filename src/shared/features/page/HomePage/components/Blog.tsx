import Link from "next/link"
import { FaArrowRightLong } from "react-icons/fa6"
import Image from "next/image"
import { Button } from "@/shared/ui/button"
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel"
import { api } from "@/utils/api"
import { AiOutlineRead } from "react-icons/ai";
type BlogItem = {
    id: number;
    slug: string;
    Thumbnail: {
        url: string;
    };
    Title: string;
    Author: string;
};
const Blog = () => {
    const { data: articles } = api.blog.getCollections.useQuery();
    console.log(articles);
    return (
        <div className='mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-10 max-w-7xl py-4 sm:py-6 md:py-8 lg:py-10'>
            <div className="flex flex-row justify-between items-start gap-3 sm:gap-0 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-Inter font-semibold">Fresh from the blog</h1>
                <Link href={'/blog'} className="flex gap-2 items-center hover:text-orange-500 transition-colors text-xs sm:text-sm md:text-base">See more <FaArrowRightLong className="w-3 h-3 sm:w-4 sm:h-4" /></Link>
            </div>
            <div className="hidden xl:grid xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {(articles as unknown as BlogItem[] | undefined)?.map((item, ix) => {
                    return (
                        <Link href={`/blog/${item.slug}`} key={ix} className="flex flex-col justify-between group cursor-pointer h-full">
                            <Image
                                src={`https://blogger-production-0439.up.railway.app${item.Thumbnail.url}`}
                                alt={item.Title}
                                width={400}
                                height={400}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
                            />
                            <span className="text-xs text-gray-500 pt-3">{item.Author}</span>
                            <h2 className="text-xs sm:text-sm md:text-base font-Inter text-gray-900 pb-3 truncate">{item.Title}</h2>
                            <Button className="text-xs bg-transparent border border-gray-300 text-gray-700 w-1/2 font-Inter hover:bg-transparent hover:border-orange-500 hover:text-orange-500" data-rybbit-event="signup_clicked"><AiOutlineRead />Read More</Button>
                        </Link>
                    )
                })}
            </div>
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full xl:hidden"
            >
                <CarouselContent>
                    {(articles as unknown as BlogItem[] | undefined)?.map((item, ix) => (
                        <CarouselItem key={ix} className="basis-1/2 pl-4 w-full">
                            <Link href={`blog/${item.slug}`} key={ix} className="flex flex-col justify-between group cursor-pointer h-full">
                                <Image
                                    src={`https://blogger-production-0439.up.railway.app${item.Thumbnail.url}`}
                                    alt={item.Title}
                                    width={400}
                                    height={600}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
                                />
                                <span className="text-xs text-gray-500 pt-3">{item.Author}</span>
                                <h2 className="text-xs sm:text-sm md:text-base font-Inter text-gray-900 pb-3 truncate">{item.Title}</h2>
                                <Button className="px-4 text-xs bg-transparent border border-gray-300 text-gray-700 w-1/2 font-Inter hover:bg-transparent hover:border-orange-500 hover:text-orange-500 gap-1" data-rybbit-event="signup_clicked"><AiOutlineRead size={5} />Read More</Button>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}
export default Blog