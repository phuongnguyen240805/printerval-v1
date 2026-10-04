import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LiquidSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  material?: 'panel' | 'card' | 'background';
}

/** Decorative material only; children retain their native layout and semantics. */
export const LiquidSurface = React.forwardRef<HTMLDivElement, LiquidSurfaceProps>(
  ({ material = 'panel', className, ...props }, ref) => (
    <div
      ref={ref}
      data-liquid-surface={material === 'panel' ? '' : undefined}
      data-liquid-card={material === 'card' ? '' : undefined}
      className={cn(material === 'background' && 'liquid-background', className)}
      {...props}
    />
  )
);
LiquidSurface.displayName = 'LiquidSurface';
