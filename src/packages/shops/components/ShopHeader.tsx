"use client"
import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import { Star } from 'lucide-react';

interface ShopHeaderProps {
    seller: {
        name: string;
        avatar: string;
        followerCount: number;
        favoriteCount: number;
        rating?: number;
        id?: string;
    };
    productCount: number;
    onFollowClick?: () => void;
    onShareClick?: () => void;
}

export const ShopHeader = ({
    seller,
    productCount,
    onFollowClick,
    onShareClick,
}: ShopHeaderProps) => {
    return (
        <>
            {/* Colorful Banner Background */}
            <div className="h-40 bg-gradient-to-r from-green-400 via-pink-500 to-blue-600"></div>

            {/* Shop Header - Overlapping Card */}
            <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10 mb-12">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
                        {/* Avatar */}
                        <div className="flex-shrink-0 flex justify-center md:justify-start">
                            <Image
                                src={seller.avatar}
                                alt={seller.name}
                                width={120}
                                height={120}
                                className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md"
                            />
                        </div>

                        {/* Shop Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{seller.name}</h1>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm mb-6 md:mb-4">
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-gray-900">{seller.followerCount}</span>
                                    <span className="text-gray-600">Followers</span>
                                </div>
                                <span className="hidden md:inline text-gray-300">|</span>
                                <div className="flex items-center justify-center md:justify-start gap-1">
                                    <span className="font-bold text-gray-900">{seller.favoriteCount}</span>
                                    <span className="text-gray-600">Favorited</span>
                                </div>
                            </div>

                            {/* Action Buttons - Full Width on Mobile */}
                            <div className="flex flex-col md:flex-row gap-3">
                                <Button
                                    onClick={onFollowClick}
                                    className="bg-black hover:bg-gray-800 text-white font-semibold rounded-full px-8 py-3 text-base w-full md:w-auto"
                                >
                                    Follow Artist
                                </Button>
                                <Button
                                    onClick={onShareClick}
                                    variant="outline"
                                    className="border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-full px-8 py-3 text-base w-full md:w-auto"
                                >
                                    Share Shop
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShopHeader;


