import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import styles from './BlogClone.module.css';

const BLOG_ITEMS = [
  {
    image: '/assets/home-reference/blog/blog-1.png',
    category: 'Lifestyle',
    title: 'How is Halloween Celebrated Around the World? Global Traditions & 2026 Guide',
    href: '/blog/how-is-halloween-celebrated-n212',
  },
  {
    image: '/assets/home-reference/blog/blog-2.png',
    category: 'Lifestyle',
    title: "Is All Saints' Day the Same as Halloween? History & Differences",
    href: '/blog/is-all-saints-day-the-same-as-halloween',
  },
  {
    image: '/assets/home-reference/blog/blog-3.png',
    category: 'Lifestyle',
    title: 'When is Halloween 2026? Date, Weekday & Planning Guide',
    href: '/blog/when-is-halloween-n644',
  },
  {
    image: '/assets/home-reference/blog/blog-4.png',
    category: 'Lifestyle',
    title: 'What Is the Meaning of Halloween? History, Etymology, and Biblical Perspective',
    href: '/blog/the-best-answer-to-what-is-the-meaning-of-halloween-n645',
  },
  {
    image: '/assets/home-reference/blog/blog-5.png',
    category: 'Gift Ideas',
    title: 'Creative Halloween T-Shirt Ideas: Slogans, Styles, and Matching Sets',
    href: '/blog/halloween-t-shirts-n906874',
  },
];

const Arrow = ({ small = false }: { small?: boolean }) => (
  <svg width={small ? 16 : 19} height={small ? 17 : 20} viewBox="0 0 19 20" fill="none" aria-hidden="true">
    <path d="M10.663 4.399a.594.594 0 0 1 .84 0l4.75 4.75a.594.594 0 0 1 0 .84l-4.75 4.75a.594.594 0 1 1-.84-.84l3.737-3.736H3.167a.594.594 0 0 1 0-1.188H14.4L10.663 5.24a.594.594 0 0 1 0-.84Z" fill="currentColor" />
  </svg>
);

export default function Blog() {
  return (
    <section data-liquid-surface="" className={styles.section} aria-labelledby="fresh-blog-heading">
      <div className={styles.header}>
        <h2 id="fresh-blog-heading" className={styles.heading}>Fresh from the blog</h2>
        <Button asChild variant="ghost"><Link href="/blog" className={styles.seeMore}>See more <Arrow /></Link></Button>
      </div>

      <div className={styles.grid}>
        {BLOG_ITEMS.map((item) => (
          <article data-liquid-card="" key={item.title} className={styles.item}>
            <Link href={item.href} className={styles.imageLink} aria-label={item.title}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 900px) 45vw, (max-width: 1200px) 30vw, 220px"
                className={styles.image}
              />
            </Link>

            <div className={styles.text}>
              <div className={styles.category}>{item.category}</div>
              <Link href={item.href} className={styles.title}>{item.title}</Link>
            </div>

            <Button asChild variant="outline"><Link href={item.href} className={styles.readMore}>
              <Arrow small /> Read more
            </Link></Button>
          </article>
        ))}
      </div>
    </section>
  );
}
