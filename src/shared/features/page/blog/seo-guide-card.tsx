'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
      >
        <section className="w-full px-2 md:px-4 py-16">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              {title}
            </h2>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:ring-2 hover:ring-purple-400"
              >
                <div className="relative w-full aspect-[3/2]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-purple-700 mb-3">
                    {post.title}
                  </h3>
                  <div className="text-gray-800 text-sm space-y-2 mb-3">
                    {post.articles.map((article, i) => (
                      <p key={i}>
                        <span className="font-semibold mr-1">{i + 1}</span>
                        {article}
                      </p>
                    ))}
                  </div>
                  <a
                    href="#"
                    className="text-purple-700 text-sm font-semibold hover:underline mb-4"
                  >
                    Đọc tất cả →
                  </a>
                  <div className="mt-auto flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-[10px] font-medium">
                      {post.tag}
                    </span>
                    <div className="flex gap-3">
                      <span>{post.totalPosts} bài</span>
                      <span>{post.totalMinutes} phút</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
