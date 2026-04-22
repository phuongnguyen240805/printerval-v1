import { api } from "@/utils/api";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Image from "next/image";
import { Button } from "../ui/button";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Link from "next/link";

const HeroComponent = ({
    product = [],
    categories = [],
}: {
    product: any[];
    categories: any[];
}) => {
    if (!categories.length) return null;

    return (
        <div className="lg:px-2">
            {/* HEADER */}
            <div className="bg-[#E5F0FA] flex flex-col items-center gap-2 py-3 lg:hidden">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Happy New Year</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="font-bold text-xl">Sale Up to 10%</h1>
                <p className="w-72 text-center text-sm">
                    New Year's Gift Ideas to Your Loved Ones
                </p>
            </div>

            {/* HERO */}
            <div className="hidden lg:grid lg:grid-cols-2 py-5 justify-between">
                <div className="flex flex-col items-center justify-center gap-3 p-5">
                    <h1 className="font-bold text-2xl">Sale Up to 10%</h1>
                    <p className="w-96 text-center text-xl">
                        Thanksgiving gifts and high-quality merch for family and friends!
                    </p>
                    <Button className="bg-black text-white hover:bg-gray-800">
                        Customize Thanksgiving Gifts
                    </Button>
                </div>

                <Image
                    src="/assets/thanksgiving-day-49f9cf01b226fe60d6e5d076abe92ad6.webp"
                    alt="Thanksgiving"
                    width={500}
                    height={500}
                    className="rounded-xl object-cover w-full h-full"
                />
            </div>

            {/* TABS */}
            <h2 className="my-4 px-2 text-center lg:text-left font-medium text-xl">
                Best Items for Happy New Year Shopping
            </h2>

            <Tabs
                defaultValue={categories[0].id}
                className="w-full"
            >
                {/* TAB LIST */}
                <TabsList className="bg-white flex flex-wrap justify-center lg:justify-start hidden lg:block">
                    {categories.map((category: any) => (
                        <TabsTrigger
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsList className="bg-white flex flex-wrap justify-center lg:justify-start lg:hidden">
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="pl-2">
                            {categories.map((category: any) => (
                                <CarouselItem className="basis-1/2 sm:basis-1/4 text-center">
                                    <TabsTrigger
                                        key={category.id}
                                        value={category.id}
                                        className="p-2 "
                                    >
                                        {category.name}
                                    </TabsTrigger>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </TabsList>
                {/* TAB CONTENT */}
                {categories.map((category: any) => {
                    const filteredProducts = category.products

                    return (
                        <TabsContent
                            key={category.id}
                            value={category.id}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
                        >
                            {filteredProducts.map((prod: any) => (
                                <Link href={`/product/${prod.id}`} key={prod.id} className="p-2">
                                    <Image
                                        src={prod.thumbnail || "/placeholder.png"}
                                        alt={prod.title}
                                        width={1280}
                                        height={720}
                                        className="object-cover w-full h-40 sm:h-80 rounded-md"
                                    />
                                    <h5 className="mt-2 text-sm font-medium truncate">
                                        {prod.title}
                                    </h5>
                                    <p className="font-semibold text-lg flex items-center gap-1">
                                        ${prod.variants?.[0]?.price || "40"}
                                        <span className="line-through text-sm text-gray-400">
                                            $30
                                        </span>
                                    </p>
                                </Link>
                            ))}
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
};

export default HeroComponent;
