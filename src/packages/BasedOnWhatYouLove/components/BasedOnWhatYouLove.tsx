'use client';

import { useEffect, useState } from 'react';
import FadeIn from '@/shared/components/FadeIn';
import ProductCard from './ProductCard';
import { getBasedOnWhatYouLove, type RecommendedProduct } from '../hooks/basedOnWhatYouLove';
import { useRecentlyViewed } from '@/packages/browsing-history/hooks/useRecentlyViewed';

type Props = {
    currentProductId: string;
    category?: string;
    limit?: number;
};

export default function BasedOnWhatYouLove({
    currentProductId,
    category,
    limit = 5,
}: Props) {
    const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Lấy recently viewed từ hook của browsing-history
    const { getRecentlyViewed } = useRecentlyViewed();
    const recentlyViewed = getRecentlyViewed().slice(0, 5);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setIsLoading(true);
                const recommended = await getBasedOnWhatYouLove({
                    currentProductId,
                    category,
                    limit,
                });
                setRecommendedProducts(recommended);
            } catch (err) {
                console.error('Error loading BasedOnWhatYouLove:', err);
                setError('Failed to load recommendations');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [currentProductId, category, limit]);

    if (isLoading || recommendedProducts.length === 0) {
        return null;
    }

    if (error) {
        console.error(error);
        return null;
    }

    return (
        <section className="py-12">
            <div className="flex items-center justify-between gap-8 mb-8">
                <h2 className="text-[24px] font-Inter text-gray-900 font-semibold">Based On What You Love</h2>
                {/* Recently Viewed - nằm trên 1 hàng với text */}
                {recentlyViewed.length > 0 && (
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <p className="text-gray-500 whitespace-nowrap text-sm">Because you viewed:</p>
                        <div className="flex gap-2">
                            {recentlyViewed.map((p) => (
                                <img
                                    key={p.id}
                                    src={p.image_url}
                                    alt={p.name}
                                    className="w-12 h-12 object-cover rounded border flex-shrink-0"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Recommended Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {recommendedProducts.map((product, index) => (
                    <FadeIn key={product.id} delay={index * 0.05} direction="up">
                        <ProductCard key={product.id} product={product} />
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}


