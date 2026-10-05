import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import styles from './ReferAndSupport.module.css';

const ArrowIcon = () => (
  <svg width="19" height="20" viewBox="0 0 19 20" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.512 1.647a.594.594 0 0 1-.589.599c-1.353.011-2.35.055-3.123.206-.756.149-1.253.392-1.637.776-.451.451-.71 1.061-.846 2.074-.138 1.029-.14 2.382-.14 4.265 0 1.883.002 3.236.14 4.265.136 1.013.395 1.623.846 2.074.451.451 1.061.71 2.074.846 1.029.139 2.382.14 4.265.14 1.883 0 3.236-.001 4.265-.14 1.013-.136 1.623-.395 2.074-.846.384-.384.627-.881.775-1.637.152-.773.196-1.77.207-3.123a.594.594 0 1 1 1.188.01c-.012 1.349-.054 2.448-.229 3.342-.179.91-.502 1.649-1.101 2.248-.709.709-1.611 1.03-2.755 1.184-1.118.15-2.551.15-4.379.15h-.09c-1.828 0-3.261 0-4.379-.15-1.144-.154-2.046-.475-2.755-1.184-.709-.709-1.03-1.611-1.184-2.755-.15-1.118-.15-2.551-.15-4.379v-.091c0-1.828 0-3.26.15-4.378.154-1.144.475-2.047 1.184-2.755.599-.599 1.338-.923 2.248-1.101.894-.175 1.993-.218 3.342-.229a.594.594 0 0 1 .599.589Zm4.527-.415a.594.594 0 0 1 .839 0l3.959 3.959a.594.594 0 0 1 0 .84L13.878 9.99a.594.594 0 0 1-.84-.84l2.945-2.945h-4.9c-1.228 0-1.953.6-2.207.855l-.152.153-.151.15c-.255.254-.854.979-.854 2.207v2.375a.594.594 0 1 1-1.188 0V9.57c0-1.65.813-2.659 1.205-3.049l.151-.15.148-.149c.389-.391 1.399-1.204 3.048-1.204h4.9L13.04 2.072a.594.594 0 0 1 0-.84Z"
      fill="currentColor"
    />
  </svg>
);

export default function ReferAndSupport() {
  return (
    <section className={styles.section} aria-label="Refer a friend and support independent creators">
      <article data-liquid-surface="" className={`${styles.card} ${styles.referCard}`}>
        <div className={styles.referContent}>
          <h2 className={styles.heading}>Refer-a-Friend</h2>
          <p className={styles.description}>
            Get $8.00 to spend each time you refer a friend — invite more, earn more!
          </p>
          <Button asChild><Link href="/refer" className={styles.button}>
            <ArrowIcon /> Refer Friends Now
          </Link></Button>
        </div>

        <div className={styles.imageLayer} aria-hidden="true">
          <Image
            src="/assets/home-reference/refer-support/refer-a-friend.png"
            alt=""
            width={390}
            height={262}
            className={styles.referImage}
          />
        </div>
      </article>

      <article data-liquid-surface="" className={`${styles.card} ${styles.supportCard}`}>
        <div className={styles.supportContent}>
          <h2 className={styles.heading}>
            Support independent <span className={styles.highlight}>Artists</span> and{' '}
            <span className={styles.highlight}>Crafters</span>
          </h2>
          <p className={styles.description}>
            There&apos;s no Printerval warehouse – all products belong to creative artists and crafters. We are just a bridge to connect you with dedicated makers and get eye-catching pieces.
          </p>
          <Button asChild><Link href="/footer/sell-your-product" className={styles.button}>
            Start selling
          </Link></Button>
        </div>

        <div className={styles.imageLayer} aria-hidden="true">
          <Image
            src="/assets/home-reference/refer-support/home-support.png"
            alt=""
            width={760}
            height={430}
            className={styles.supportImage}
          />
        </div>
      </article>
    </section>
  );
}
