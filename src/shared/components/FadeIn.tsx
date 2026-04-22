'use client';
import React from 'react';
import { LazyMotion, domMax, m } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  scale?: number;
  duration?: number; // Thêm nếu bạn muốn chỉnh thời gian
  amount?: number; // BỔ SUNG DÒNG NÀY ĐỂ FIX LỖI
}

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  scale = 1,
  duration = 0.8,
  amount = 0.25, // Giá trị mặc định là 1/4 màn hình
}: FadeInProps) {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
      scale: scale,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
    },
  };

  return (
    <LazyMotion features={domMax}>
      <m.div
        initial="hidden"
        whileInView="visible"
        variants={variants}
        transition={{
          duration: duration,
          delay: delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        // Sử dụng prop amount ở đây
        viewport={{ once: true, amount: amount }}
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
