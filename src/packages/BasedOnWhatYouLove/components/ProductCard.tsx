"use client";
import Link from 'next/link';
import Image from 'next/image';
import type { RecommendedProduct } from '../hooks/basedOnWhatYouLove';

interface Props {
    product: RecommendedProduct;
}

export default function ProductCard({ product }: Props) {
    const imageUrl = product.image;
    const productUrl = `/product/${product.handle}`;
    const currentPrice = (product.price / 100).toFixed(2);
    const originalPrice = product.comparePrice ? (product.comparePrice / 100).toFixed(2) : null;
    const discount = product.discount;

    return (
        <Link href={productUrl}>
            <div className="group cursor-pointer">
                <div className="relative w-full aspect-square h-[155px] sm:h-[220px] lg:h-[270px] overflow-hidden rounded-xl">
                    <Image
                        src={imageUrl}
                        alt={product.title}
                        fill
                        className='object-cover transition-transform duration-500 group-hover:scale-125'
                    />
                </div>

                {/* Info */}
                <div className=' sm:p-3 flex flex-col flex-grow'>
                    <h2 className='text-14px sm:text-sm font-semibold font-Inter text-gray-600 line-clamp-2 leading-tight min-h-[1.5rem]'>
                        {product.title}
                    </h2>

                    <div className='flex flex-wrap items-center gap-2'>
                        <span className='text-base sm:text-[16px] font-semibold font-Inter text-[#111111]'>
                            ${currentPrice}
                        </span>
                        {discount > 0 && (
                            <>
                                <span className='text-xs font-Inter text-gray-400 line-through'>
                                    ${originalPrice}
                                </span>
                                <span className="bg-[#FFF4E5] text-[#FF8A00] text-sm font-semibold font-Inter px-2  rounded-full">
                                    {discount}% OFF
                                </span>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </Link>
    );
}


