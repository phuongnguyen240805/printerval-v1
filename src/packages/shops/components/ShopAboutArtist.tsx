"use client"
import Image from 'next/image';

interface ShopAboutArtistProps {
    seller: {
        name: string;
        avatar: string;
        id?: string;
    };
    description?: string;
}

export const ShopAboutArtist = ({ seller, description }: ShopAboutArtistProps) => {
    const defaultDescription = `This artist is part of our global creative community, bringing unique ideas to life through original designs. Each piece reflects a blend of creativity, personality, and attention to detail — crafted to help you express yourself in your own way.

From everyday essentials to standout statements, their work is made to inspire, connect, and add a personal touch to your style.`;

    return (
        <div className="bg-white py-16 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left: Large Avatar */}
                    <div className="flex justify-center">
                        <div className="relative w-full max-w-md aspect-square">
                            <Image
                                src={seller.avatar}
                                alt={seller.name}
                                width={400}
                                height={400}
                                priority
                                className="rounded-3xl shadow-lg object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: About Text */}
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">About the {seller.name}</h2>

                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            {(description || defaultDescription).split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="text-base md:text-lg">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Stats or CTA can go here */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold text-gray-900">100+</div>
                                    <div className="text-sm text-gray-600">Products</div>
                                </div>
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold text-gray-900">5K+</div>
                                    <div className="text-sm text-gray-600">Happy Customers</div>
                                </div>
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold text-gray-900">4.8★</div>
                                    <div className="text-sm text-gray-600">Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopAboutArtist;


