'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FadeIn from './Fadeoad';
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
    srcSet?: string;
    sizes?: string;
  };
  author: {
    name: string;
    url: string;
    avatar: string;
  };
  excerpt?: string;
}

interface AgencyCardProps {
  title?: string;
  posts: BlogPost[];
  className?: string;
}

const AgencyCardPropsSection: React.FC<AgencyCardProps> = ({
  title = 'Bài viết nổi bật',
  posts,
  className = '',
}) => {
  return (
    <section className={`sec-blogr sec-bloghc2 py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Tiêu đề */}
        <FadeIn direction="up" amount={0.25}>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-600 dark:text-neutral-100 uppercase">
            {title}
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <FadeIn
              key={post.id}
              direction="up"
              delay={(index % 4) * 0.1}
              amount={0.25}
            >
            
                <BlogCard post={post} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => (

  <div className="bg-white border border-gray-300 dark:bg-neutral-900 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
    {/* Author Header */}
    <div className="p-3 dark:border-neutral-800 flex items-center gap-2">
      <Image
        src={post.author.avatar}
        alt="Author avatar"
        width={20}
        height={20}
        className="w-5 h-5 object-cover rounded-full"
      />
      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">
        Bởi{' '}
        <Link
          href={post.author.url}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          {post.author.name}
        </Link>
      </span>
    </div>

    <Link
      href={`/blog/${post.slug}`}
      className="block group flex-grow flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={post.featuredImage.src}
          alt={post.featuredImage.alt}
          width={post.featuredImage.width}
          height={post.featuredImage.height}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          sizes={
            post.featuredImage.sizes ||
            '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          }
        />
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="block text-sm font-bold text-gray-800 dark:text-neutral-100 group-hover:text-blue-600 transition-colors mb-2">
            <div className="line-clamp-2 leading-snug">{post.title}</div>
          </h3>
          {post.excerpt && (
            <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3 italic opacity-80">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Action Link */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-blue-600 group-hover:text-blue-800 transition-colors font-bold uppercase tracking-wider">
            Xem thêm
          </span>

          <svg
            className="w-3 h-3 text-blue-600 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  </div>
);

export default AgencyCardPropsSection;