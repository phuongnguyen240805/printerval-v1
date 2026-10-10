import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './CatalogCarousel.module.css';

export function CatalogCarousel({
  label,
  children,
  compact = false,
}: {
  label: string;
  children: ReactNode;
  compact?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () =>
      setEdges({
        start: element.scrollLeft <= 2,
        end:
          element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
      });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      element.removeEventListener('scroll', update);
    };
  }, [children]);
  const move = (direction: number) => {
    const element = track.current;
    if (!element) return;
    const first = element.firstElementChild as HTMLElement | null;
    const distance = first
      ? first.offsetWidth +
        parseFloat(getComputedStyle(element).columnGap || '0')
      : element.clientWidth;
    element.scrollBy({
      left: direction * distance,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  };
  return (
    <div
      className={`${styles.carousel} ${compact ? styles.compact : ''}`}
      role="region"
      aria-label={label}
      aria-roledescription="carousel"
    >
      <div
        ref={track}
        className={styles.track}
        tabIndex={0}
        onKeyDown={event => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            move(event.key === 'ArrowLeft' ? -1 : 1);
          }
        }}
      >
        {children}
      </div>
      <div className={styles.controls}>
        <button
          data-catalog-variant="secondary"
          type="button"
          disabled={edges.start}
          onClick={() => move(-1)}
          aria-label={`${label}: trước`}
        >
          ‹
        </button>
        <button
          data-catalog-variant="secondary"
          type="button"
          disabled={edges.end}
          onClick={() => move(1)}
          aria-label={`${label}: tiếp theo`}
        >
          ›
        </button>
      </div>
    </div>
  );
}
