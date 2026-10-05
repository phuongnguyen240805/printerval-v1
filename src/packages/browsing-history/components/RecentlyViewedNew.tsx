'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRecentlyViewed, type RecentlyViewedItem } from '@/packages/browsing-history/hooks/useRecentlyViewed';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel';
import styles from './RecentlyViewedNew.module.css';

const FALLBACK_ITEM: RecentlyViewedItem = {
  id: 'reference-halloween-1978',
  name: 'Halloween 1978 Original Graphic T Shirt',
  image_url: '/assets/home-reference/recently-viewed/halloween-1978.jpeg',
  url: '/product/halloween-1978-original-graphic-t-shirt',
  price: '$16.95',
  compare_at_price: '$29.95',
  handle: 'halloween-1978-original-graphic-t-shirt',
  viewedAt: 0,
};

const toNumber = (value?: string) => {
  const parsed = Number.parseFloat(String(value ?? '').replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function RecentlyViewedNew() {
  const { getRecentlyViewed } = useRecentlyViewed();
  const [viewed, setViewed] = useState<RecentlyViewedItem[]>([FALLBACK_ITEM]);

  useEffect(() => {
    const load = () => {
      const items = getRecentlyViewed();
      setViewed(items.length > 0 ? items : [FALLBACK_ITEM]);
    };

    load();

    const handleUpdate = (event: Event) => {
      const detail = (event as CustomEvent<RecentlyViewedItem[]>).detail ?? [];
      setViewed(detail.length > 0 ? detail : [FALLBACK_ITEM]);
    };

    window.addEventListener('recently-viewed-updated', handleUpdate);
    return () => window.removeEventListener('recently-viewed-updated', handleUpdate);
  }, []);

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Recently viewed</h2>

      <Carousel opts={{ align: 'start', dragFree: true }} className={styles.carousel}>
        <CarouselContent className={styles.content}>
          {viewed.map((item) => {
            const price = toNumber(item.price);
            const compareAt = toNumber(item.compare_at_price);

            return (
              <CarouselItem key={item.id} className={styles.slide}>
                <article data-liquid-card="" className={styles.card}>
                  <Link href={item.url} className={styles.imageLink} aria-label={item.name}>
                    <Image
                      src={item.image_url || '/placeholder.png'}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className={styles.image}
                    />
                  </Link>

                  <div className={styles.info}>
                    <Link href={item.url} className={styles.title}>
                      {item.name}
                    </Link>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>${price.toFixed(2)}</span>
                      {compareAt > price && (
                        <span className={styles.oldPrice}>${compareAt.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </article>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className={styles.prev} />
        <CarouselNext className={styles.next} />
      </Carousel>
    </div>
  );
}

