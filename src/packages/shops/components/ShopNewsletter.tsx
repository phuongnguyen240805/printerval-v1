"use client"
import { useState } from 'react';
import { Mail } from 'lucide-react';

interface ShopNewsletterProps {
    onSubscribe?: (email: string) => void;
}

export const ShopNewsletter = ({ onSubscribe }: ShopNewsletterProps) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            onSubscribe?.(email);
            setEmail('');
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            {/* Newsletter Section */}
            <div className="bg-gray-50 rounded-2xl px-8 text-center">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">
                    Never miss out on a moment
                </h2>

                <p className="text-gray-700 text-base mb-2">
                    Stay updated with the latest trends, exclusive offers, and exciting updates by signing up for our newsletter.
                </p>
                <p className="text-gray-600 text-sm mb-8">
                    Secret privileges for your purchase will be delivered straight to your inbox.
                </p>

                {/* Email Input Form */}
                <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-6">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            {isLoading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </div>
                </form>

                {/* Privacy Policy Notice */}
                <p className="text-gray-600 text-xs max-w-md mx-auto">
                    By clicking Subscribe, you agree to our{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                    </a>{' '}
                    and to receive our promotional emails (opt out anytime).
                </p>
            </div>
        </div>
    );
};

export default ShopNewsletter;


