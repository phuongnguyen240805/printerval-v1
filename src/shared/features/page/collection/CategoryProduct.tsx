'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import { Button } from "@/shared/ui/button";

interface Product {
    id: string;
    handle: string;
    title: string;
    thumbnail: string | null;
    price?: string | number;
    metadata?: Record<string, unknown> | null;
}

interface CategoryProductProps {
    products: Product[];
    totalCount?: number;
    showLoadMore?: boolean;
    onLoadMore?: () => void;
    isLoading?: boolean;
}

const CategoryProduct = ({
    products = [],
    showLoadMore = false,
    onLoadMore,
    isLoading = false
}: CategoryProductProps) => {
    const [sortBy, setSortBy] = useState("most-relevant");

    const formatPrice = (price: string | number | undefined) => {
        if (!price) return "$17.95";
        if (typeof price === 'string') return price.startsWith('$') ? price : `$${price}`;
        return `$${price.toFixed(2)}`;
    };

    const getRating = (product: Product) => {
        return (product.metadata?.rating as number) || 4.5;
    };

    const getReviewCount = (product: Product) => {
        return (product.metadata?.reviews as number) || Math.floor(Math.random() * 500) + 50;
    };

    const getDiscount = (product: Product): number | null => {
        const discount = product.metadata?.discount;
        return typeof discount === 'number' ? discount : null;
    };

    const getBrand = (product: Product): string => {
        const brand = product.metadata?.brand;
        return typeof brand === 'string' ? brand : "Pivot Measuring";
    };

    const getOriginalPrice = (product: Product): number | null => {
        const originalPrice = product.metadata?.originalPrice;
        return typeof originalPrice === 'number' ? originalPrice : null;
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-medium text-gray-900">
                        About {products.length} Results
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="most-relevant">Most Relevant</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="newest">Newest</option>
                        <option value="best-selling">Best Selling</option>
                    </select>

                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filter
                    </Button>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {/* Create Your Own Card */}
                <div className="bg-[#e5e5e599] p-1 rounded-xl cursor-pointer">
                    <Link href={'/create'}>
                        <Image src={'/assets/create-your-own-new.png'} alt={'Create your own product'} width={400} height={500} className="w-full" />
                        <div className="uppercase flex flex-col text-2xl p-1 gap-2 italic text-shadow-lg justify-center">
                            <span className="text-[#2b96cc] font-bold">Create</span>
                            <span className="text-[#ff7300] font-bold">Your Own</span>
                        </div>
                    </Link>
                </div>

                {/* Product Cards */}
                {products.map((product) => {
                    const rating = getRating(product);
                    const reviewCount = getReviewCount(product);

                    return (
                        <Link href={`/product/${product.handle}`} key={product.id}>
                            <div className="relative group">
                                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                                    {/* Product Image */}
                                    <div className="aspect-square relative bg-gray-50">
                                        <Image
                                            src={product.thumbnail || "/placeholder.jpg"}
                                            alt={product.title}
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />

                                        {/* Favorite Button */}
                                        <div className="absolute top-3 right-3">
                                            <ToggleGroup type="multiple" size="sm" variant="outline">
                                                <ToggleGroupItem
                                                    value={`favorite-${product.id}`}
                                                    aria-label="Toggle Favorite"
                                                    className="rounded-full bg-white/90 hover:bg-white data-[state=on]:bg-[#F57A20] data-[state=on]:text-white border-gray-200"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                </ToggleGroupItem>
                                            </ToggleGroup>
                                        </div>

                                        {/* Discount Badge */}
                                        {getDiscount(product) && (
                                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                                                {getDiscount(product)}% off
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-3">
                                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm hover:text-blue-600 transition-colors">
                                            {product.title}
                                        </h3>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-1">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < Math.floor(rating)
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-600">({reviewCount})</span>
                                        </div>

                                        {/* Brand */}
                                        <div className="text-xs text-gray-500 mb-1">
                                            By {getBrand(product)}
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-red-500">
                                                {formatPrice(product.price)}
                                            </span>
                                            {getOriginalPrice(product) && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    ${(getOriginalPrice(product)! / 100).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Load More Section */}
            {
                showLoadMore && (
                    <div className="flex justify-center mt-8">
                        <Button
                            onClick={onLoadMore}
                            disabled={isLoading}
                            variant="outline"
                            size="lg"
                            className="px-8 py-3"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Loading more...
                                </>
                            ) : (
                                "Load More Products"
                            )}
                        </Button>
                    </div>
                )
            }

            {/* No Products Message */}
            {
                products.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found.</p>
                    </div>
                )
            }
        </div >
    );
};

export default CategoryProduct;