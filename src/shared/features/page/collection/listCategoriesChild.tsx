import Link from "next/link";
import { useState, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import { Button } from "@/shared/ui/button";
import { api } from "@/utils/api";

interface CategoryChild {
    id?: string;
    name: string;
    handle: string;
    description?: string;
}

interface ListCategoriesChildProps {
    category_children: CategoryChild[];
    initialDisplayCount?: number;
    loadMoreCount?: number;
    showSeeAllButton?: boolean;
    handle?: string;
}

const ListCategoriesChild = ({
    category_children = [],
    initialDisplayCount = 6,
    loadMoreCount = 6,
    showSeeAllButton = true,
    handle,
}: ListCategoriesChildProps) => {
    const [displayCount, setDisplayCount] = useState(initialDisplayCount);
    const [isLoading, setIsLoading] = useState(false);

    // For mobile carousel, show all categories
    // For desktop grid, use pagination
    const displayedCategoriesMobile = category_children;
    const displayedCategoriesDesktop = category_children.slice(0, displayCount);
    const hasMoreCategories = displayCount < category_children.length;

    const handleLoadMore = useCallback(async () => {
        setIsLoading(true);

        // Simulate loading delay (remove in production if not needed)
        await new Promise(resolve => setTimeout(resolve, 500));

        setDisplayCount(prevCount =>
            Math.min(prevCount + loadMoreCount, category_children.length)
        );
        setIsLoading(false);
    }, [loadMoreCount, category_children.length]);

    // Don't render if no categories
    if (!category_children?.length) {
        return null;
    }

    return (
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Mobile Carousel */}
            <Carousel
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="w-full lg:hidden"
            >
                <CarouselContent className="pl-4 gap-1">
                    {displayedCategoriesMobile.map((child, index) => (
                        <CarouselItem key={child.id || index} className="basis-2/5 sm:basis-1/3 md:basis-1/4">
                            <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                                <Link
                                    href={`${handle}/${child.handle}`}
                                    className="block p-3 text-center hover:bg-gray-50 transition-colors duration-200"
                                    title={child.description || child.name}
                                >
                                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                                        {child.name}
                                    </h3>
                                </Link>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Desktop Grid */}
            <div className="hidden lg:grid lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {displayedCategoriesDesktop.map((child, index) => (
                    <div
                        key={child.id || index}
                        className="rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                    >
                        <Link
                            href={child.handle}
                            className="block p-3 text-center hover:bg-gray-50 transition-colors duration-200"
                            title={child.description || child.name}
                        >
                            <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                                {child.name}
                            </h3>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Action Buttons - Only show on desktop */}
            {(hasMoreCategories || showSeeAllButton) && (
                <div className="hidden lg:flex justify-center gap-4 mt-6">
                    {hasMoreCategories && (
                        <Button
                            variant="outline"
                            onClick={handleLoadMore}
                            disabled={isLoading}
                            className="text-sm font-medium px-6 py-2 hover:bg-orange-50 hover:border-orange-300 transition-colors duration-200"
                        >
                            {isLoading ? 'Loading...' : 'Load More'}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};
export default ListCategoriesChild;