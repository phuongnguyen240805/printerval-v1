"use client"
import ProductGrid from '@/packages/YouMightLoveThese/components/ProductGrid';

interface Product {
    id: string;
    title: string;
    handle: string;
    thumbnail: string;
    price: number;
    originalPrice?: number;
}

interface ShopFeaturedProductsProps {
    products: Product[];
    shopName?: string;
}

export const ShopFeaturedProducts = ({ products, shopName = "Shop" }: ShopFeaturedProductsProps) => {
    const featuredProducts = products.slice(0, 8); // Show first 8 products

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 mb-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                    <p className="text-sm text-gray-600">From {shopName}</p>
                </div>
            </div>
            <ProductGrid
                products={featuredProducts}
                title=""
                linkHref={(product) => `/product/${product.handle}`}
            />
        </div>
    );
};

export default ShopFeaturedProducts;


