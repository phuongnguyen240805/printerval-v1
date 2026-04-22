// components/ExploreRelatedSearches.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRelatedSearches, type RelatedSearchItem } from '../hook/useRelatedSearches';

interface Props {
  currentProduct: any;
  title?: string;
  className?: string;
}

export default function ExploreRelatedSearches({
  currentProduct,
  title = "Explore Related Searches",
  className = "",
}: Props) {

  const { relatedItems } = useRelatedSearches(currentProduct);

  if (relatedItems.length === 0) return null;

  return (
    <div className={`mt-2 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {title}
      </h2>

      <div className="flex  px-4 flex-wrap gap-6 justify-center md:justify-start">
        {relatedItems.map((item: RelatedSearchItem, index: number) => (
          <Link
            key={index}
            href={item.href}
            className="group flex flex-col items-center text-center transition-all hover:-translate-y-1"
          >
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-white group-hover:shadow-xl transition-shadow">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.label}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-5xl font-bold text-gray-400">
                  {item.label[0]}
                </div>
              )}
            </div>

            <p className="mt-3 text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
              {item.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

