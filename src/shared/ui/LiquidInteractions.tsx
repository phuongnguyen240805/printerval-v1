'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { liquidInteraction } from './liquid/config';

// Delegation also covers controls mounted later in dialogs, menus and route changes.
const controls = liquidInteraction.selector;

export function LiquidInteractions() {
  const [mounted, setMounted] = useState(false);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let active: HTMLElement | null = null;
    let x = 50;
    let y = 50;
    const ripples = new Set<HTMLElement>();
    const find = (target: EventTarget | null) => {
      const el = target instanceof Element ? target.closest<HTMLElement>(controls) : null;
      return el && !el.matches(liquidInteraction.excluded) && !el.closest('[data-liquid="off"]') ? el : null;
    };
    const clearActive = () => {
      active?.style.removeProperty('--liquid-x');
      active?.style.removeProperty('--liquid-y');
      active = null;
    };
    const move = (event: PointerEvent) => {
      if (reduced.matches || event.pointerType === 'touch') return;
      const el = find(event.target);
      if (el !== active) { clearActive(); active = el; }
      if (!el) return;
      const rect = el.getBoundingClientRect();
      x = (event.clientX - rect.left) / Math.max(rect.width, 1) * 100;
      y = (event.clientY - rect.top) / Math.max(rect.height, 1) * 100;
      if (!frame) frame = requestAnimationFrame(() => {
        active?.style.setProperty('--liquid-x', `${x}%`);
        active?.style.setProperty('--liquid-y', `${y}%`);
        frame = 0;
      });
    };
    const press = (event: PointerEvent) => {
      if (reduced.matches || event.button !== 0 || !layer.current) return;
      const el = find(event.target);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const clip = document.createElement('div');
      clip.className = 'liquid-touch-clip';
      Object.assign(clip.style, {
        left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`,
        height: `${rect.height}px`, borderRadius: getComputedStyle(el).borderRadius,
      });
      const drop = document.createElement('span');
      drop.className = 'liquid-touch-drop';
      const size = Math.max(rect.width, rect.height) * liquidInteraction.rippleSize;
      Object.assign(drop.style, {
        width: `${size}px`, height: `${size}px`,
        left: `${event.clientX - rect.left - size / 2}px`,
        top: `${event.clientY - rect.top - size / 2}px`,
      });
      clip.append(drop);
      layer.current.append(clip);
      ripples.add(clip);
      if (ripples.size > liquidInteraction.maxRipples) { const oldest = ripples.values().next().value as HTMLElement; oldest.remove(); ripples.delete(oldest); }
      const animation = drop.animate([
        { transform: 'scale(.08)', opacity: .9 },
        { transform: 'scale(.65)', opacity: .65, offset: .45 },
        { transform: 'scale(1)', opacity: 0 },
      ], { duration: liquidInteraction.rippleDuration, easing: liquidInteraction.easing });
      const remove = () => { clip.remove(); ripples.delete(clip); };
      animation.onfinish = remove;
      animation.oncancel = remove;
    };
    const reset = () => {
      clearActive();
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      ripples.forEach(el => el.remove()); ripples.clear();
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerdown', press, { passive: true });
    document.addEventListener('pointerleave', reset);
    document.addEventListener('scroll', reset, { passive: true, capture: true });
    window.addEventListener('resize', reset);
    reduced.addEventListener('change', reset);
    return () => {
      reset();
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerdown', press);
      document.removeEventListener('pointerleave', reset);
      document.removeEventListener('scroll', reset, true);
      window.removeEventListener('resize', reset);
      reduced.removeEventListener('change', reset);
    };
  }, [mounted]);

  return mounted ? createPortal(<div ref={layer} className="liquid-touch-layer" aria-hidden="true" />, document.body) : null;
}
