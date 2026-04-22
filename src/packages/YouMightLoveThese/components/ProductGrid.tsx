// ProductGrid.tsx - UI component (không có logic)
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

type Product = {
    id: string;
    title: string;
    handle: string;
    thumbnail: string;
    price: number;
    originalPrice?: number;
};

interface ProductGridProps {
    products: Product[];
    title?: string;
    onProductClick?: (product: Product) => void;
    linkHref?: (product: Product) => string; // Custom link generator
}

export default function ProductGrid({
    products,
    title = "Products",
    onProductClick,
    linkHref = (product) => `/products/${product.handle}`,
}: ProductGridProps) {

    if (products.length === 0) return null;

    return (
        <section className="py-1 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-start mb-6 md:mb-10">{title}</h2>
                <div className="grid grid-rows-2 md:grid-rows-1 grid-flow-col gap-4 md:gap-6 
                                overflow-x-auto snap-x snap-mandatory pb-4 
                                auto-cols-[160px] sm:auto-cols-[200px] md:auto-cols-[220px] lg:auto-cols-[240px]
                                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={linkHref(product)}
                            className="group snap-start"
                            onClick={() => onProductClick?.(product)}
                        >
                            <div className="relative aspect-[4/3.5] overflow-hidden rounded-2xl bg-white shadow-sm">
                                <Image
                                    src={product.thumbnail}
                                    alt={product.title}
                                    fill
                                    sizes="(max-width: 768px) 160px, (max-width: 1024px) 220px, 240px"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-sm"
                                >
                                    <Heart size={18} className="text-gray-600" />
                                </button>
                            </div>

                            <div className="mt-3 px-1">
                                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-orange-600 transition-colors">
                                    {product.title}
                                </h3>
                                <div className="flex items-baseline gap-2 mt-1.5">
                                    <span className="font-semibold text-base md:text-lg">
                                        ${(product.price / 100).toFixed(2)}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-gray-400 line-through text-xs md:text-sm">
                                            ${(product.originalPrice / 100).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

