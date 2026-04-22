"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockProducts } from "@/lib/mockProduct"; 

interface RelatedProductsProps {
  currentProductId: string;   
  collectionId?: string;      
  tags?: string[];            
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProductId, collectionId }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setIsLoading(true);
      try {
        const query = collectionId ? `?collection_id[]=${collectionId}&limit=6` : `?limit=6`;
        const res = await fetch(`/store/products${query}`, {
          headers: {
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
          }
        });
        
        if (!res.ok) throw new Error("Fetch failed");
        
        const data = await res.json();
        
        const filteredProducts = (data.products || []).filter(
          (item: any) => item.id !== currentProductId && item.handle !== currentProductId
        );
        
        setProducts(filteredProducts);
      } catch (error) {
        const mockFallback = mockProducts.filter((p: any) => p.id !== currentProductId).slice(0, 5);
        setProducts(mockFallback);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentProductId) {
      fetchRelatedProducts();
    }
  }, [currentProductId, collectionId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="my-10 border-t pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Có thể bạn cũng thích</h2>
      <div className="flex gap-5 overflow-x-auto pb-6 hide-scrollbar px-1">
        {products.map((item: any, idx: number) => {
          
          const originalPrice = item.variants?.[0]?.calculated_price?.original_amount;
          const calculatedPrice = item.variants?.[0]?.calculated_price?.calculated_amount 
                        || item.variants?.[0]?.prices?.[0]?.amount / 100 
                        || 0;

          const discountPercent = (originalPrice && calculatedPrice && originalPrice > calculatedPrice)
            ? Math.round(((originalPrice - calculatedPrice) / originalPrice) * 100)
            : 0;

          return (
            <Link 
              href={`/product/${item.handle || item.id}`} 
              key={`${item.id}-${idx}`} 
              // Giao diện thẻ: Box shadow nhẹ, bo góc tròn 12px (xl), ẩn các phần dư thừa
              className="min-w-[220px] max-w-[220px] bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] border border-gray-100 flex flex-col relative group transition-all duration-300 overflow-hidden"
            >
              {/* KHU VỰC ẢNH */}
              <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
                <Image 
                  src={item.thumbnail || '/assets/placeholder.png'} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              {/* KHU VỰC THÔNG TIN */}
              <div className="p-4 flex flex-col flex-1">
                <span className="text-base font-medium text-black line-clamp-2 mb-3 leading-snug">
                  {item.title}
                </span>
                
                {/* Giá tiền và % Giảm giá */}
                <div className="flex items-center flex-wrap gap-2 mt-auto">
                  <span className="text-xl font-bold text-[#d32f2f]"> {/* Đỏ đậm */}
                    ${calculatedPrice > 0 ? calculatedPrice.toFixed(2) : 0}
                  </span>
                  
                  {discountPercent > 0 && (
                    <>
                      <span className="text-sm font-medium text-gray-400 line-through">
                        ${originalPrice}
                      </span>
                      <span className="text-xs font-bold text-[#e65100] bg-[#ffe0b2] px-2 py-0.5 rounded-full">
                        -{discountPercent}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* NÚT TÙY CHỈNH (Màu xanh chuẩn theo ảnh) */}
              <div className="w-full py-3.5 bg-[#2563eb] text-white text-center font-bold text-[15px] group-hover:bg-[#1d4ed8] transition-colors mt-auto">
                 Customize Now
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;