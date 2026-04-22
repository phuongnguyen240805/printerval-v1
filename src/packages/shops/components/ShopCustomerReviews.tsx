"use client"
import { Star } from 'lucide-react';

interface Review {
    id: string;
    name: string;
    initials: string;
    rating: number;
    text: string;
    date: string;
}

interface ShopCustomerReviewsProps {
    reviews?: Review[];
}

// Mock reviews data
const MOCK_REVIEWS: Review[] = [
    {
        id: '1',
        name: 'Avery Johnson',
        initials: 'A',
        rating: 5,
        text: 'These jungle animal curtains are adorable! They add a playful vibe to the room, and the fabric feels pretty good quality for the price. Definitely a hit with my kid.',
        date: 'Aug 07, 2025',
    },
    {
        id: '2',
        name: 'Chris L.',
        initials: 'C',
        rating: 4,
        text: 'Not the best quality, but they do the job. Colors are a bit dull in person, but my kid loves the cartoon animals, so overall not bad.',
        date: 'Aug 08, 2025',
    },
    {
        id: '3',
        name: 'EmilyH',
        initials: 'E',
        rating: 5,
        text: 'Love these jungle animal curtains! They add a playful touch to my daughter\'s room. The fabric feels nice and the print is colorful without being overwhelming. Delivery was quick too!',
        date: 'Aug 08, 2025',
    },
    {
        id: '4',
        name: 'Emma',
        initials: 'E',
        rating: 5,
        text: 'Love it! Perfect for kids bedroom. Great quality and fast shipping.',
        date: 'Aug 15, 2025',
    },
];

export const ShopCustomerReviews = ({ reviews = MOCK_REVIEWS }: ShopCustomerReviewsProps) => {
    const getAvatarColor = (initials: string) => {
        const colors = [
            'bg-blue-200',
            'bg-purple-200',
            'bg-pink-200',
            'bg-green-200',
            'bg-yellow-200',
            'bg-indigo-200',
        ];
        const index = initials.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            {/* Header */}
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

            {/* Reviews Scroll Container */}
            <div className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        {/* Header with Avatar and Name */}
                        <div className="flex items-start gap-3 mb-3">
                            <div
                                className={`${getAvatarColor(
                                    review.initials
                                )} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-gray-700`}
                            >
                                {review.initials}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{review.name}</h3>
                                <div className="flex gap-0.5">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className="fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Review Text */}
                        <p className="text-gray-600 italic text-sm mb-4 line-clamp-4">
                            {review.text}
                        </p>

                        {/* Date */}
                        <p className="text-gray-400 text-xs">{review.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopCustomerReviews;


