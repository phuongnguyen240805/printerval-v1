import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowUpRight, Gift, PencilLine, Tag } from 'lucide-react';

type GlassLens = { destroy: () => void };
type GlassWindow = Window & {
  liquidGL?: (options: Record<string, unknown>) => GlassLens | GlassLens[] | undefined;
};

const shortcuts = [
  { label: 'Find a gift', href: '#home-gifts', Icon: Gift },
  { label: 'Discover deals', href: '#home-deals', Icon: Tag },
  { label: 'Make it yours', href: '/create-your-own', Icon: PencilLine },
];

/** Small, bounded snapshot: the product feed never becomes a GPU texture. */
export function HomeGlassIntro() {
  const stageRef = useRef<HTMLElement>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady || !stageRef.current) return;
    const stage = stageRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)');
    let lenses: GlassLens[] = [];
    let disposed = false;
    let visible = false;
    let generation = 0;

    const destroy = () => {
      generation += 1;
      lenses.forEach((lens) => lens.destroy());
      lenses = [];
    };
    const update = async () => {
      destroy();
      if (disposed || !visible || document.hidden || reducedMotion.matches || reducedTransparency.matches) return;
      const currentGeneration = generation;
      await document.fonts.ready;
      if (disposed || currentGeneration !== generation) return;
      try {
        const result = (window as GlassWindow).liquidGL?.({
          target: '#home-glass-stage .home-glass-lens',
          snapshot: '#home-glass-snapshot',
          content: false,
          engine: 'auto',
          resolution: 1,
          zIndex: 12,
          refraction: 0.008,
          bevelDepth: 0.035,
          bevelWidth: 0.12,
          frost: 1.5,
          aberration: 0,
          magnify: 1,
          tint: 'rgba(255, 252, 247, 0.28)',
          shadow: false,
          specular: false,
          tilt: false,
          draggable: false,
          interaction: 'none',
          reveal: 'none',
        });
        lenses = result ? (Array.isArray(result) ? result : [result]) : [];
      } catch (error) {
        destroy();
        // The CSS glass surface and native links remain usable if GPU setup fails.
        if (process.env.NODE_ENV === 'development') console.warn('Homepage glass uses CSS fallback.', error);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      void update();
    });
    observer.observe(stage);
    reducedMotion.addEventListener('change', update);
    reducedTransparency.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      disposed = true;
      observer.disconnect();
      reducedMotion.removeEventListener('change', update);
      reducedTransparency.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
      destroy();
    };
  }, [scriptReady]);

  return (
    <>
      <Script src="/vendor/liquid-gl/liquidGL.js" strategy="lazyOnload" onReady={() => setScriptReady(true)} />
      <section ref={stageRef} id="home-glass-stage" className="home-glass-intro" aria-labelledby="home-glass-title">
        <div id="home-glass-snapshot" className="home-glass-backdrop" aria-hidden="true">
          <div className="home-glass-orb home-glass-orb-peach" />
          <div className="home-glass-orb home-glass-orb-lilac" />
        </div>
        <div className="home-glass-intro-copy" data-liquid-ignore>
          <span className="home-glass-eyebrow">A little thought. A lot of meaning.</span>
          <h1 id="home-glass-title">Everyday things.<br className="sm:hidden" /> <span>Uniquely yours.</span></h1>
          <p>Discover thoughtful gifts and designs that feel like you.</p>
        </div>
        <nav className="home-glass-shortcuts" aria-label="Explore Printerval" data-liquid-ignore>
          {shortcuts.map(({ label, href, Icon }) => (
            <Link key={href} href={href} className="home-glass-shortcut">
              <span className="home-glass-lens" aria-hidden="true" />
              <span className="home-glass-shortcut-content"><Icon size={17} strokeWidth={1.6} /><span>{label}</span><ArrowUpRight size={14} /></span>
            </Link>
          ))}
        </nav>
      </section>
    </>
  );
}
