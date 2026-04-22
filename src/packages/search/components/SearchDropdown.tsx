"use client";
import Link from 'next/link';
import Image from 'next/image';
import { RecentList } from "./RecentList";
import { TrendingList } from "./TrendingList";
import { MOCK_CATEGORIES } from "../mockData";

interface Product {
  id: string;
  handle: string;
  title: string;
  thumbnail: string;
  variants: Array<{
    calculated_price: {
      calculated_amount: number;
      original_amount: number;
    }
  }>;
}

interface Props {
  recentSearches: string[];
  trending: string[];
  picks: Product[];
  isLoading: boolean;
  onItemClick: (term: string) => void;
}
export function SearchDropdown({ recentSearches, trending, picks, isLoading, onItemClick }: Props) {
  return (
    <div className="absolute top-full left-0 mt-2 w-full rounded-lg bg-white p-6 shadow-2xl z-50 border border-gray-100 flex flex-col">

      {/* PHẦN TRÊN: Grid 2 cột */}
      <div className="grid grid-cols-12 gap-8">
        {/* Cột trái: Lịch sử và Xu hướng (chiếm 3/12) */}
        <div className="col-span-3 border-r pr-4">
          <RecentList data={recentSearches} onItemClick={onItemClick} />
          <TrendingList data={trending} isLoading={isLoading} onItemClick={onItemClick} />
        </div>

        {/* Cột phải: Special Picks + Categories (chiếm 9/12) */}
        <div className="col-span-9 flex flex-col gap-4">
          <h3 className="mb-2 text-sm font-Inter font-semibold text-gray-700">Today's Special Picks</h3>
          {isLoading ? (
            <div className="text-sm text-gray-400">Loading products...</div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {picks.map((product) => {
                const originalPrice = (product.variants?.[0]?.calculated_price?.original_amount / 100).toFixed(2);
                const salePrice = (product.variants?.[0]?.calculated_price?.calculated_amount / 100).toFixed(2);

                return (
                  <Link key={product.id} href={`/product/${product.handle}`} className="group cursor-pointer block">
                    <div className="relative w-full aspect-square h-[70px] overflow-hidden rounded-md bg-gray-100 mb-2">
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        loading="eager"
                        sizes="150px"
                        className='object-cover transition-transform duration-500 group-hover:scale-125'
                      />
                    </div>
                    <h4 className="text-sm font-Inter text-gray-900 truncate">{product.title}</h4>
                    <div className="flex gap-2 items-center text-sm">
                      <span className="text-red-600 font-Inter font-semibold">${salePrice}</span>
                      <span className="text-gray-400 font-Inter font-semibold line-through">${originalPrice}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Categories nằm dưới Special Picks, trong cùng cột phải */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {MOCK_CATEGORIES.map((category, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onItemClick(category.name)}
                  className={`${category.color} text-white px-4 py-2 rounded text-sm font-Inter transition-colors shadow-sm`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

