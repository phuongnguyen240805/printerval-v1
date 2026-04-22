'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import FadeIn from '../ui/Fadeoad';
import Boderyelow from '@/components/ui/boder-yelow'; // Đảm bảo import đúng đường dẫn

interface Post {
  id: string | number;
  title: string;
  image: string;
  articles: string[];
  tag: string;
  totalPosts: number;
  totalMinutes: number;
}

interface PostSummaryCardProps {
  title?: string;
  posts: Post[];
}

export default function PostSummaryCard({
  title,
  posts,
}: PostSummaryCardProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="w-full px-4 md:px-6 py-10 md:py-16">
      {/* Tiêu đề chính */}
      <FadeIn direction="up" amount={0.25}>
        <h2 className="text-xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-black dark:text-white uppercase tracking-tight">
          {title}
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {posts.map((post, index) => (
          <FadeIn
            key={post.id}
            direction="up"
            delay={index * 0.1}
            amount={0.1}
          >
            {/* Bọc Boderyelow bên ngoài Motion Div để lấy hiệu ứng viền vàng */}
            <Boderyelow>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[3/2] flex-shrink-0">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                {/* Content Body */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-purple-400 mb-2 line-clamp-2 min-h-[2.5rem] leading-snug">
                    {post.title}
                  </h3>

                  {/* Articles list */}
                  <div className="text-gray-600 dark:text-gray-400 text-xs space-y-1.5 mb-4 flex-grow">
                    {post.articles.slice(0, 3).map((article, i) => (
                      <p key={i} className="line-clamp-1 italic opacity-90">
                        <span className="font-bold text-purple-500/40 mr-1">{i + 1}.</span>
                        {article}
                      </p>
                    ))}
                  </div>

                  <a
                    href="#"
                    className="text-purple-700 dark:text-purple-400 text-xs font-bold hover:underline mb-4 inline-flex items-center"
                  >
                    Đọc tất cả <span className="ml-1">→</span>
                  </a>

                  {/* Footer Info */}
                  <div className="mt-auto flex items-center justify-between text-[9px] md:text-[11px] text-gray-500 pt-3 border-t border-gray-50 dark:border-neutral-800/50">
                    <span className="bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                      {post.tag}
                    </span>
                    <div className="flex gap-2 font-medium">
                      <span>{post.totalPosts} bài</span>
                      <span className="opacity-30">|</span>
                      <span>{post.totalMinutes} phút</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Boderyelow>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}