// components/reviews/Reviews.tsx
'use client';

import { useState, useEffect } from 'react';
// Dữ liệu review giả lập - thay thế bằng API thực khi backend sẵn sàng
export const MOCK_REVIEWS: Array<{
    id: string;
    fullName: string;
    rating: number;
    content: string;
    createdAt: Date;
    images: string[];
}> = [
        {
            id: '1',
            fullName: 'John Doe',
            rating: 5,
            content: 'Amazing quality! The shirt is very comfortable and the print is perfect.',
            createdAt: new Date('2025-02-15'),
            images: [],
        },
        {
            id: '2',
            fullName: 'Jane Smith',
            rating: 4.5,
            content: 'Great product. Delivery was fast. Highly recommend!',
            createdAt: new Date('2025-02-10'),
            images: [],
        },
        {
            id: '3',
            fullName: 'Mike Johnson',
            rating: 5,
            content: 'Good quality for the price. Would order again.',
            createdAt: new Date('2025-02-01'),
            images: [],
        },
    ];
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { MdOutlineDriveFolderUpload } from 'react-icons/md';
import { GiPencilRuler } from 'react-icons/gi';
import Image from 'next/image';

// ====================== Review Item ======================
export const ReviewItem = ({
    review,
}: {
    review: {
        id: string;
        fullName: string;
        rating: number;
        content: string;
        createdAt: Date;
        images?: string[];
    };
}) => {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <div className="py-5 flex flex-col gap-3 border-dotted border-b-2">
            <div className="flex justify-between items-center">
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => {
                        const index = i + 1;
                        return (
                            <span key={index} className="text-yellow-400">
                                {review.rating >= index ? (
                                    <BsStarFill />
                                ) : review.rating >= index - 0.5 ? (
                                    <BsStarHalf />
                                ) : (
                                    <BsStar />
                                )}
                            </span>
                        );
                    })}
                </div>
                <div className="flex gap-2 items-center text-xs text-gray-500">
                    <span>{review.fullName}</span>
                    <small>|</small>
                    <span>{formatDate(new Date(review.createdAt))}</span>
                </div>
            </div>
            <p className="text-sm">{review.content}</p>
            {review.images && review.images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {review.images.map((img, idx) => (
                        <Image
                            key={idx}
                            src={img}
                            alt="Review image"
                            width={80}
                            height={80}
                            className="object-cover rounded"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ====================== Empty State ======================
const EmptyReviews = () => (
    <div className="flex flex-col items-center py-10">
        <p className="text-center text-sm sm:text-base mt-4 max-w-xs">
            No reviews yet. Be the first to share your experience!
        </p>
    </div>
);

// ====================== Main Reviews Component ======================
interface ReviewsProps {
    productId?: string;
    star?: number;
    date?: string;
    canReview?: boolean; // Chỉ cho phép review nếu đã mua sản phẩm
}

export default function Reviews({ productId, star = 4.8, date = '11/2/2025', canReview = false }: ReviewsProps) {

    const [tab, setTab] = useState<'item' | 'shop'>('item');
    const [page, setPage] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviews, setReviews] = useState(MOCK_REVIEWS);
    const pageSize = 5;

    // Tính điểm đánh giá trung bình từ review data thực tế
    const calculateAverageRating = (reviewsList: typeof MOCK_REVIEWS): number => {
        if (!reviewsList || reviewsList.length === 0) return 0;
        const sum = reviewsList.reduce((acc, review) => acc + review.rating, 0);
        return Math.round((sum / reviewsList.length) * 10) / 10; // Làm tròn 1 chữ số
    };

    // Dữ liệu đánh giá - lấy từ review thực tế
    const ratingData = {
        avg: calculateAverageRating(reviews), // Tính từ reviews
        total: reviews.length,
    };

    const commentsData = {
        comments: reviews.slice(page * pageSize, (page + 1) * pageSize),
        meta: { total: reviews.length },
    };

    // Form state
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        title: '',
        content: '',
        rating: 5,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [images, setImages] = useState<string[]>([]); // URLs sau khi upload
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    // Reset form
    useEffect(() => {
        setForm({
            fullName: '',
            email: '',
            title: '',
            content: '',
            rating: 5,
        });
    }, []);

    // Reset form khi mở
    useEffect(() => {
        if (showForm) {
            setErrors({});
            setImages([]);
            setPreviewImages([]);
        }
    }, [showForm]);

    // Validate form
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!form.fullName.trim()) newErrors.fullName = 'Name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            newErrors.email = 'Invalid email format';
        if (!form.title.trim()) newErrors.title = 'Title is required';
        if (!form.content.trim()) newErrors.content = 'Content is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle image upload (preview trước, upload thật khi submit)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);

        if (images.length + files.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        const newPreviews: string[] = [];
        files.forEach((file) => {
            if (file.size > 2 * 1024 * 1024) {
                alert('Image too large (max 2MB)');
                return;
            }
            newPreviews.push(URL.createObjectURL(file));
        });

        setPreviewImages((prev) => [...prev, ...newPreviews]);
        // Lưu file thật để upload sau (hoặc dùng presigned URL)
        // Ở đây giả định bạn upload trong mutation
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // Mock submit - replace with real API when backend is ready
            const newReview = {
                id: String(reviews.length + 1),
                fullName: form.fullName,
                rating: form.rating,
                content: `"${form.title}" - ${form.content}`,
                createdAt: new Date(),
                images: previewImages as string[],
            };

            setReviews([newReview, ...reviews]);
            alert('Your review has been submitted!');
            setShowForm(false);
            setForm({
                fullName: '',
                email: '',
                title: '',
                content: '',
                rating: 5,
            });
            setPreviewImages([]);
            setImages([]);
        } catch (error: any) {
            alert('Failed to submit review: ' + (error?.message || 'Unknown error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalPages = Math.ceil((commentsData?.meta.total || 0) / pageSize);

    return (
        <div className="w-full flex flex-col gap-4 px-2 sm:px-4">
            <h3 className="font-bold text-xl sm:text-2xl">Reviews</h3>

            <Tabs value={tab} onValueChange={(v) => { setTab(v as 'item' | 'shop'); setPage(0); }}>
                <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="item">Reviews for this item</TabsTrigger>
                    <TabsTrigger value="shop">Reviews for this shop</TabsTrigger>
                </TabsList>

                <TabsContent value="item">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-sans">{ratingData.avg}</span>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => {
                                const index = i + 1;
                                return (
                                    <span key={i} className="text-yellow-400">
                                        {ratingData.avg >= index ? (
                                            <BsStarFill />
                                        ) : ratingData.avg >= index - 0.5 ? (
                                            <BsStarHalf />
                                        ) : (
                                            <BsStar />
                                        )}
                                    </span>
                                );
                            })}
                        </div>
                        <span className="text-sm text-gray-500">
                            ({ratingData.total} reviews)
                        </span>
                    </div>

                    {(commentsData?.comments.length ?? 0) === 0 ? (
                        <EmptyReviews />
                    ) : (
                        commentsData?.comments.map((review) => (
                            <ReviewItem key={review.id} review={review} />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="shop">
                    {/* Tương tự item, bạn có thể copy phần trên và thay target */}
                    <EmptyReviews /> {/* tạm thời, thay bằng logic shop */}
                </TabsContent>
            </Tabs>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => page > 0 && setPage(page - 1)}
                        disabled={page === 0}
                    >
                        Previous
                    </Button>

                    {[...Array(totalPages)].map((_, i) => (
                        <Button
                            key={i}
                            variant={page === i ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPage(i)}
                        >
                            {i + 1}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => page < totalPages - 1 && setPage(page + 1)}
                        disabled={page === totalPages - 1}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/*  Nút viết review - chỉ hiển thị nếu đã mua sản phẩm */}
            {canReview ? (
                <Button
                    variant="outline"
                    onClick={() => setShowForm(true)}
                    className="w-full sm:w-auto bg-orange-50 border-[#FF7300] text-[#FF7300]"
                >
                    <GiPencilRuler className="mr-2" /> Viết đánh giá của bạn
                </Button>
            ) : (
                <div className="w-full p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                    <p className="text-yellow-800 font-sans">
                        ⚠️ Vui lòng mua sản phẩm trước khi viết đánh giá
                    </p>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 p-4 sm:p-6 border rounded-lg bg-white shadow-sm"
                >
                    <h4 className="font-sans text-lg">Write a Review</h4>

                    {/* Star Rating */}
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => {
                            const index = i + 1;
                            return (
                                <button
                                    type="button"
                                    key={index}
                                    className="text-yellow-400 text-3xl focus:outline-none transition-transform hover:scale-110"
                                    onClick={() => setForm({ ...form, rating: index })}
                                >
                                    {form.rating >= index ? <BsStarFill /> : <BsStar />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Your Name *</Label>
                            <Input
                                id="name"
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                placeholder="Enter your name"
                            />
                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                        </div>

                        <div>
                            <Label htmlFor="email">Your Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Summary of your review"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                            id="content"
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            placeholder="Write your review here..."
                            rows={5}
                        />
                        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                    </div>

                    {/* Upload Images */}
                    <div>
                        <Label>Add Photos (max 5)</Label>
                        <div className="mt-2 flex flex-wrap gap-3">
                            {previewImages.map((src, idx) => (
                                <div key={idx} className="relative w-20 h-20 sm:w-24 sm:h-24">
                                    <Image src={src} alt="preview" fill className="object-cover rounded" />
                                </div>
                            ))}
                            {previewImages.length < 5 && (
                                <label className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-gray-50">
                                    <MdOutlineDriveFolderUpload className="text-2xl text-gray-400" />
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowForm(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}

