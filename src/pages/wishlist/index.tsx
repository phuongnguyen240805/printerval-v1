"use client"

import { PrimaryLayout } from "@/layouts";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";

// 1. IMPORT KHO DỮ LIỆU ẢO
import { mockProducts } from "@/lib/mockProduct";
import RelatedProducts from "@/shared/components/RelatedProducts";

const WishListPage = () => {
    const [wishlist, setWishList] = useState<string[]>([]);
    const [isClient, setIsClient] = useState(false);
    const regionID = typeof window !== 'undefined' ? localStorage.getItem("selected_region") : null;

    useEffect(() => {
        setIsClient(true);
        const storedWishlist = localStorage.getItem("wishlist");
        if (storedWishlist) {
            try {
                const parsed = JSON.parse(storedWishlist);
                if (Array.isArray(parsed)) {
                    setWishList(parsed);
                }
            } catch (error) {
                console.error("Lỗi parse wishlist", error);
            }
        }
    }, []);

    // 2. GỌI API TÌM HÀNG THẬT
    const { data: realProducts, isLoading } = api.medusa.getProductRecent.useQuery(
        { ids: wishlist, regionID: regionID || undefined },
        { enabled: wishlist.length > 0 } 
    );

    // 3. TÌM HÀNG ẢO NẾU API KHÔNG CÓ
    const mockProductsInWishlist = wishlist
        .map(id => mockProducts.find((p: any) => p?.id === id || p?.handle === id))
        .filter(Boolean);

    // 4. GỘP CẢ HÀNG THẬT LẪN HÀNG ẢO VÀ LỌC SẠCH UNDEFINED
    const displayProducts = [
        ...(realProducts || []),
        ...mockProductsInWishlist
    ].filter(Boolean); // Loại bỏ mọi giá trị null/undefined rác nếu có

    // Loại bỏ sản phẩm trùng lặp an toàn
    const uniqueProducts = Array.from(
        new Map(displayProducts.map((item: any) => [item?.id || item?.handle, item])).values()
    );

    if (!isClient) return null;

    return (
        <div className="py-6 lg:px-4 max-w-7xl mx-auto">
            <h1 className="text-2xl font-medium px-4 lg:px-0">Wishlist</h1>
            
            {wishlist.length > 0 && isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                </div>
            ) : uniqueProducts && uniqueProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 py-8 px-4 lg:px-0">
                    {uniqueProducts.map((item: any) => {
                        
                        // FIX TS ERROR: Bảo vệ thêm 1 lớp nữa, nếu item undefined thì bỏ qua luôn
                        if (!item) return null;

                        const originalPrice = item?.variants?.[0]?.calculated_price?.original_amount;
                        const calculatedPrice = item?.variants?.[0]?.calculated_price?.calculated_amount;
                        
                        const discountPercent = (originalPrice && calculatedPrice && originalPrice > calculatedPrice)
                            ? Math.round(((originalPrice - calculatedPrice) / originalPrice) * 100)
                            : 0;

                        return (
                            <Link href={`/product/${item?.handle || item?.id}`} className='group col-span-1 flex flex-col rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden' key={item?.id || item?.handle}>
                                <div className="relative w-full h-40 lg:h-48 bg-gray-50">
                                    <Image
                                        src={item?.thumbnail as string || '/assets/placeholder.png'}
                                        alt={item?.title || "Product"}
                                        fill
                                        className='object-cover group-hover:scale-105 transition-transform duration-500'
                                    />
                                </div>
                                
                                <div className='p-3 bg-white flex flex-col flex-1'>
                                    <h2 className='text-sm font-medium mb-2 line-clamp-2 flex-1'>{item?.title}</h2>
                                    
                                    <div className='flex flex-wrap items-center gap-2 mb-3'>
                                        <p className='text-base font-bold text-red-600'>${calculatedPrice || 0}</p>
                                        
                                        {discountPercent > 0 && (
                                            <div className="flex gap-2 items-center">
                                                <span className='text-xs font-medium text-gray-400 line-through'>${originalPrice}</span>
                                                <span className='px-1.5 py-0.5 text-[10px] text-orange-600 font-bold bg-orange-100 rounded-full'>
                                                    -{discountPercent}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full p-3 bg-blue-500 text-white text-center font-semibold text-sm group-hover:bg-blue-600 transition-colors mt-auto">
                                    Customize Now
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 py-16">
                    <Image src={'/assets/wishlist-empty.gif'} alt="wishlist" width={300} height={300} className="w-64 h-64 object-cover" />
                    <p className="font-medium text-gray-600">Your wishlist is empty.</p>
                    <Link href={'/'} className="mt-2 border border-transparent bg-orange-500 hover:bg-orange-600 transition-colors text-white font-bold rounded-full px-8 py-3">
                        Continue Shopping
                    </Link>
                </div>
            )}
            
            <div className="mt-8">
                <RelatedProducts currentProductId={wishlist[0] || ""}/>
            </div>
        </div>
    );
}

export default WishListPage;

WishListPage.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <PrimaryLayout seo={{ title: 'Wishlist', canonical: '/wishlist' }}>
            {page}
        </PrimaryLayout>
    );
}