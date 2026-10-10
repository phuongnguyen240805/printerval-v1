# Clone catalog UI/UX patch

Changes are already applied in this workspace. `clone-ui-ux.patch` contains only this implementation's changes to 35 files under `src`; it excludes the pre-existing changes to `next-env.d.ts` and the earlier AI catalog edits.

Run commands from the repository root. Do not apply the patch again while these changes are present.

## Undo this implementation

```powershell
git apply --reverse --check patches/clone-ui-ux.patch
git apply --reverse patches/clone-ui-ux.patch
```

## Reapply after undoing

```powershell
git apply --check patches/clone-ui-ux.patch
git apply patches/clone-ui-ux.patch
```

The baseline is the working tree at the start of this implementation, including previous uncommitted AI catalog changes. A clean checkout of the same commit can therefore differ from the expected baseline. If `--check` fails after other edits, review the differences before applying; do not force the patch. The manifest records normalized LF source hashes before and after.

## Scope

- Shared glass dialog with focus trap, Escape, scroll lock and focus restoration.
- Shared three-step AI checkout: package selection, payment method, secure-payment form. GamsGo layout proportions use the existing storefront Liquid Glass palette, typography and controls, with responsive scrolling and anchored actions.
- All AI catalog, official package and marketplace purchase entry points use the same checkout. Annual and marketplace quotes retain their original period and amount; top-ups are one-time purchases. Back navigation preserves the package, while switching renewal resets an incompatible payment method.
- Checkout is a frontend preview: only the documented test card is accepted, card values are cleared on completion/close, no API transaction or storage is used, and card-saving is disabled. Additional protection and actual payment-provider integration remain unavailable. Payment-brand labels are text placeholders; certification badges were not copied.
- Shared scroll-snap carousel with touch, keyboard and previous/next controls.
- Shared primary, secondary and text control variants; one coupon component/session state.
- Full card content, independent equal-height rows, adjusted typography and responsive sizing.
- Real filtering of available frontend records, exact plan facets, honest counts, real pagination, reset and empty states.
- Official account package detail routes, contract detail routes and news navigation.
- Grouped contract team, testimonial carousel, reference-size guide frame and news density.

## Validation and remaining content

- Seventeen tests pass: five offer-filter checks, eight checkout pricing/validation checks, and four dialog interaction checks covering navigation, focus, invalid card feedback, Escape and successful preview with card-field removal.
- Targeted component TypeScript check passes; ESLint has no errors (existing image optimization warnings remain).
- Seven catalog/detail routes respond with HTTP 200.
- Reverse check and reverse/apply round trip pass in a separate copy without changing this workspace.
- Full-project TypeScript is blocked by an existing syntax error in `src/server/api/routers/bought-together.ts:28`.
- Browser automation could not initialize. Rendered pixel alignment and touch/virtual-keyboard behavior still need manual review at desktop/tablet/mobile widths; focus on checkout step changes and Escape are covered by DOM interaction tests.
- SVOD, Games and New have no supplied inventory; their empty states are intentional. No fictional inventory was added.
- The bundle has no video or contract downloads. The guide offers interactive steps and accepts a future `videoSrc`; download controls explain unavailable files.
- Full news article bodies are absent; their routes display an explicit updating state. Purchase and coupon flows remain frontend previews without payment or account provisioning.


