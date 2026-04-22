"use client"
import ProductGrid from '@/packages/YouMightLoveThese/components/ProductGrid';
import { useState, useMemo } from 'react';

interface Product {
    id: string;
    title: string;
    handle: string;
    thumbnail: string;
    price: number;
    originalPrice?: number;
    category?: string;
}

interface ShopAllProductsProps {
    products: Product[];
}

export const ShopAllProducts = ({ products }: ShopAllProductsProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All Products');

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set(['All Products']);
        products.forEach(p => {
            if (p.category) {
                cats.add(p.category.charAt(0).toUpperCase() + p.category.slice(1));
            }
        });
        return Array.from(cats);
    }, [products]);

    // Filter products by category
    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'All Products') {
            return products;
        }
        return products.filter(p =>
            p.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
    }, [products, selectedCategory]);

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            {/* Header */}
            <h2 className="text-3xl font-bold text-gray-900 mb-8">All Products</h2>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all flex-shrink-0 ${selectedCategory === category
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Products Grid - Reuse ProductGrid Component */}
            <ProductGrid
                products={filteredProducts.map(p => ({
                    id: p.id,
                    title: p.title,
                    handle: p.handle,
                    thumbnail: p.thumbnail,
                    price: p.price,
                    originalPrice: p.originalPrice,
                }))}
                title=""
                linkHref={(product) => `/product/${product.handle}`}
            />
        </div>
    );
};

export default ShopAllProducts;


