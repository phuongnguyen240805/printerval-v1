import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

type Drop = { x: number; y: number; width: number; height: number };

/** Only the decorative surface is filtered. Links, focus rings and menus stay native. */
export function WaterNavigation({ enabled, className, children }: {
  enabled: boolean;
  className: string;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const tailRef = useRef<HTMLSpanElement>(null);
  const [drops, setDrops] = useState<Drop[]>([]);
  const filterId = `water-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let leaveTimer: ReturnType<typeof setTimeout> | undefined;
    let lastTime = 0;
    let disposed = false;
    let current: HTMLElement | null = null;
    let body: (Drop & { vx: number; vy: number; tailX: number; tailY: number }) | null = null;
    let destination: Drop | null = null;

    const bounds = (element: HTMLElement): Drop => {
      const outer = root.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      return { x: rect.left - outer.left, y: rect.top - outer.top, width: rect.width, height: rect.height };
    };
    const measure = () => {
      const items = Array.from(root.querySelectorAll<HTMLElement>('[data-water-item]'));
      const next = items.map(bounds).filter((drop) => drop.width && drop.height);
      setDrops((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
      if (current) {
        destination = bounds(current);
        body = { ...destination, vx: 0, vy: 0, tailX: destination.x, tailY: destination.y };
        paint();
      }
    };
    const paint = () => {
      if (!body || !headRef.current || !tailRef.current) return;
      const stretch = motion.matches ? 0 : Math.min(Math.abs(body.vx) * 1.9, 36);
      Object.assign(headRef.current.style, {
        transform: `translate3d(${body.x - stretch / 2}px, ${body.y}px, 0)`,
        width: `${body.width + stretch}px`, height: `${body.height}px`,
      });
      Object.assign(tailRef.current.style, {
        transform: `translate3d(${body.tailX + body.width * .18}px, ${body.tailY + body.height * .12}px, 0)`,
        width: `${body.width * .64}px`, height: `${body.height * .76}px`,
      });
    };
    const animate = (time: number) => {
      frame = 0;
      if (!body || !destination || disposed) return;
      const dt = Math.min((time - (lastTime || time - 16.67)) / 16.67, 2);
      lastTime = time;
      body.vx = (body.vx + (destination.x - body.x) * .15 * dt) * Math.pow(.7, dt);
      body.vy = (body.vy + (destination.y - body.y) * .15 * dt) * Math.pow(.7, dt);
      body.x += body.vx * dt;
      body.y += body.vy * dt;
      body.width += (destination.width - body.width) * .2 * dt;
      body.height += (destination.height - body.height) * .2 * dt;
      body.tailX += (body.x - body.tailX) * .17 * dt;
      body.tailY += (body.y - body.tailY) * .17 * dt;
      paint();
      const unsettled = Math.abs(destination.x - body.x) + Math.abs(destination.y - body.y)
        + Math.abs(body.x - body.tailX) + Math.abs(body.y - body.tailY)
        + Math.abs(destination.width - body.width) + Math.abs(destination.height - body.height)
        + Math.abs(body.vx) + Math.abs(body.vy);
      if (unsettled > .15) frame = requestAnimationFrame(animate);
    };
    const activate = (event: Event) => {
      const element = (event.target as Element).closest<HTMLElement>('[data-water-item]');
      if (!element || !root.contains(element)) return;
      clearTimeout(leaveTimer);
      root.dataset.waterEngaged = 'true';
      if (current === element) return;
      current?.removeAttribute('data-water-active');
      current = element;
      current.dataset.waterActive = 'true';
      destination = bounds(current);
      if (!body || motion.matches) {
        body = { ...destination, vx: 0, vy: 0, tailX: destination.x, tailY: destination.y };
        paint();
      } else if (!frame) {
        lastTime = 0;
        frame = requestAnimationFrame(animate);
      }
    };
    const leave = () => {
      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        if (root.contains(document.activeElement)) return;
        delete root.dataset.waterEngaged;
        current?.removeAttribute('data-water-active');
        current = null;
      }, 220);
    };
    const blur = (event: FocusEvent) => {
      if (!root.contains(event.relatedTarget as Node | null)) leave();
    };
    const resetMotion = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (destination) {
        body = { ...destination, vx: 0, vy: 0, tailX: destination.x, tailY: destination.y };
        paint();
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    root.querySelectorAll('[data-water-item]').forEach((element) => observer.observe(element));
    void document.fonts.ready.then(() => { if (!disposed) measure(); });
    root.addEventListener('pointerover', activate);
    root.addEventListener('pointerdown', activate);
    root.addEventListener('pointerleave', leave);
    root.addEventListener('pointercancel', leave);
    root.addEventListener('focusin', activate);
    root.addEventListener('focusout', blur);
    motion.addEventListener('change', resetMotion);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(leaveTimer);
      observer.disconnect();
      root.removeEventListener('pointerover', activate);
      root.removeEventListener('pointerdown', activate);
      root.removeEventListener('pointerleave', leave);
      root.removeEventListener('pointercancel', leave);
      root.removeEventListener('focusin', activate);
      root.removeEventListener('focusout', blur);
      motion.removeEventListener('change', resetMotion);
      current?.removeAttribute('data-water-active');
      delete root.dataset.waterEngaged;
    };
  }, [enabled]);

  return (
    <div ref={rootRef} className={`${className}${enabled ? ' water-navigation' : ''}`}>
      {enabled && <>
        <svg className="water-filter-definition" aria-hidden="true" width="0" height="0" focusable="false">
          <defs><filter id={filterId} x="-15%" y="-70%" width="130%" height="240%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="water-blur" />
            <feColorMatrix in="water-blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
          </filter></defs>
        </svg>
        <div className="water-navigation-surface" aria-hidden="true" style={{ filter: `url(#${filterId})` }}>
          {drops.map((drop, index) => <span key={index} className="water-navigation-resting-drop" style={{ left: drop.x, top: drop.y, width: drop.width, height: drop.height }} />)}
          <span ref={tailRef} className="water-navigation-moving-drop water-navigation-tail" />
          <span ref={headRef} className="water-navigation-moving-drop water-navigation-head" />
        </div>
      </>}
      {children}
    </div>
  );
}
