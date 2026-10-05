'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useStoryData } from '../hook/useStoryData';
import { StoryViewer } from './StoryViewer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/shared/ui/carousel';
import styles from './StoryList.module.css';

export function StoryList() {
  const { stories } = useStoryData();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api || activeStoryIndex !== null || stories.length <= 1) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const autoplayId = window.setInterval(() => {
      if (!reducedMotion.matches && !document.hidden) api.scrollNext();
    }, 2800);

    return () => window.clearInterval(autoplayId);
  }, [api, activeStoryIndex, stories.length]);

  if (!stories.length) return null;

  const handleClose = (lastViewedIndex: number) => {
    setActiveStoryIndex(null);
    api?.scrollTo(lastViewedIndex);
  };

  return (
    <section className={styles.section} aria-label="Printerval Story">
      <div className={styles.titleWrap}>
        <Image
          src="/assets/home-reference/story/printerval-story.png"
          width={168}
          height={32}
          alt="Printerval Story"
          className={styles.logo}
        />
      </div>

      <Carousel
        setApi={setApi}
        opts={{ align: 'start', dragFree: false, loop: true, slidesToScroll: 1 }}
        className={styles.carousel}
      >
        <CarouselContent className={styles.content}>
          {stories.map((story, index) => (
            <CarouselItem key={story.id} className={styles.slide}>
              <button
                data-liquid-card=""
                type="button"
                className={styles.card}
                onClick={() => setActiveStoryIndex(index)}
                aria-label={`Open story: ${story.product.name}`}
              >
                <Image
                  src={story.thumbnail_poster}
                  alt={story.product.name}
                  fill
                  sizes="(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 240px"
                  className={styles.poster}
                />
                <span className={styles.overlay} />

                <span data-liquid-surface="" className={styles.detail}>
                  <span className={styles.thumbWrap}>
                    <Image
                      src={story.product.thumbnail_logo}
                      alt=""
                      fill
                      sizes="48px"
                      className={styles.thumb}
                    />
                  </span>
                  <span className={styles.meta}>
                    <span className={styles.name}>{story.product.name}</span>
                    <span className={styles.price}>${story.product.price.toFixed(2)}</span>
                  </span>
                </span>

                <span className={styles.play} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
                    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                  </svg>
                </span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className={styles.prev} />
        <CarouselNext className={styles.next} />
      </Carousel>

      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={handleClose}
        />
      )}
    </section>
  );
}

