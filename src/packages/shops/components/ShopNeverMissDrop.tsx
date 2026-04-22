"use client"
import { Button } from '@/shared/ui/button';

interface ShopNeverMissDropProps {
    onFollowClick?: () => void;
}

export const ShopNeverMissDrop = ({ onFollowClick }: ShopNeverMissDropProps) => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            {/* Dark Banner Section */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-900 rounded-3xl px-8 py-16 text-center shadow-lg">
                <h2 className="text-4xl font-bold text-white mb-4">Never miss a drop</h2>

                <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
                    Follow this artist to see new designs first and get exclusive discounts on collection launches.
                </p>

                <button
                    onClick={onFollowClick}
                    className="bg-red-400 hover:bg-red-500 text-white font-semibold py-3 px-8 rounded-full transition-colors inline-block"
                >
                    Follow Artist
                </button>
            </div>
        </div>
    );
};

export default ShopNeverMissDrop;


