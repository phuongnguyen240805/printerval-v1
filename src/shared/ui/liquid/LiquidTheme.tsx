'use client';

import type { PropsWithChildren } from 'react';
import { LiquidInteractions } from '../LiquidInteractions';

/** Mount once per router root, so route changes and portals share one engine. */
export function LiquidTheme({ children }: PropsWithChildren) {
  return <><LiquidInteractions />{children}</>;
}
