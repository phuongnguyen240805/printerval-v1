// The interaction engine and custom controls share this contract.
export const liquidInteraction = {
  selector: 'button:not([role="switch"]):not([role="checkbox"]):not([role="radio"]), [data-liquid-control], [data-liquid-card], a[href^="/product"]:has(img), a[class*="rounded"][class*="bg-"]:not(:has(img)), select, [role="button"], [role="option"], [role="menuitem"], [role="tab"]',
  excluded: ':disabled, [aria-disabled="true"], [data-disabled], [role="switch"], [role="checkbox"], [role="radio"], [data-liquid="off"]',
  rippleDuration: 620,
  maxRipples: 8,
  rippleSize: 1.8,
  easing: 'cubic-bezier(.2,.7,.2,1)',
} as const;
