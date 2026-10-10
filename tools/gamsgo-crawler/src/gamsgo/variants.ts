import { createHash } from 'node:crypto';
import type { Page } from 'playwright';
import type { Coverage, GamsgoConfig, VariantQuote } from './types.js';
import { parsePrice, PRICE_PATTERN } from './price.js';

const GROUPS = String.raw`(() => {
 const compact=s=>(s||'').replace(/Đã bán hết|Đăng ký/g,'').replace(/\s+/g,' ').trim();
 const roots=[...document.querySelectorAll('[role="dialog"],.purchase-panel,main,[role="main"]')];
 const root=document.querySelector('.purchase-panel')||roots.find(el=>el.getAttribute('role')==='dialog')||roots[0]||document.body;
 for(const control of root.querySelectorAll('[data-testid^="payment-sku-screen-option-"]')) {
   const area=control.parentElement;
   area.setAttribute('data-option-group','Chọn loại');
 }
 for(const control of root.querySelectorAll('[data-testid^="payment-sku-month-option-"]'))control.parentElement.setAttribute('data-option-group','Thời hạn');
 const groups=[];
 const renewal=root.querySelector('[data-testid="payment-sku-details-auto-renewal"] [role="switch"], [data-testid="payment-sku-details-auto-renewal"] input[type="checkbox"]');
 if(renewal)groups.push({label:'Tự động gia hạn',values:['Bật','Tắt'],selected:(renewal.getAttribute('aria-checked')==='true'||renewal.checked===true)?'Bật':'Tắt'});
 for(const area of root.querySelectorAll('fieldset,[role="radiogroup"],[data-option-group],[class*="sku-group" i],[class*="period-group" i],[class*="plan-options" i]')) {
   if(getComputedStyle(area).display==='none'||area.closest('[hidden]'))continue;
   const label=compact(area.getAttribute('data-option-group')||area.getAttribute('aria-label')||area.querySelector('legend,[data-option-label],h3,h4')?.textContent)||'Option '+(groups.length+1);
   const values=[...area.querySelectorAll('button,[role="radio"],input[type="radio"],select option')].filter(el=>!el.disabled&&el.getAttribute('aria-disabled')!=='true').map(el=>compact(el.getAttribute('data-value')||el.getAttribute('aria-label')||(el.tagName==='INPUT'?(el.labels?.[0]?.textContent||el.value):el.textContent))).filter(t=>t&&!/mua ngay|thanh toán|buy now|checkout|coupon/i.test(t));
   const selectedControl=area.querySelector('[aria-checked="true"],input:checked,option:checked');
   const selected=selectedControl?compact(selectedControl.getAttribute('data-value')||selectedControl.getAttribute('aria-label')||(selectedControl.tagName==='INPUT'?(selectedControl.labels?.[0]?.textContent||selectedControl.value):selectedControl.textContent)):undefined;
   if(values.length)groups.push({label,values:[...new Set(values)],selected});
 }
 const priority={'Tự động gia hạn':0,'Chọn loại':1,'Thời hạn':2}; return groups.sort((a,b)=>(priority[a.label]??3)-(priority[b.label]??3));
})`;
const groupsFn = new Function(`return (${GROUPS})`)() as () => Array<{
  label: string;
  values: string[];
  selected?: string;
}>;
const QUOTE = String.raw`(() => {
 const compact=s=>(s||'').replace(/\s+/g,' ').trim();
 const root=document.querySelector('.purchase-panel')||document.querySelector('[role="dialog"]')||document.querySelector('[data-purchase],[class*="sku-panel" i],[class*="product-info" i]')||document.querySelector('main,[role="main"]')||document.body;
 const targeted=root.querySelector('[data-total],[class*="total-price" i],[class*="sale-price" i],[class*="selling-price" i],[class*="current-price" i],[class="price"]');
 const rawText=compact(root.innerText||root.textContent);
 const regex=new RegExp(__PRICE__,'i');
 const renewal=rawText.match(/(?:giá gia hạn|renewal price)\s*([^\n]{0,80})/i)?.[1]||'';
 return {priceRaw:compact(targeted?.innerText||targeted?.textContent),renewalRaw:renewal.match(regex)?.[0]||'',rawText:rawText.slice(0,30000)};
})`;
const quoteFn = new Function(
  `return (${QUOTE.replace('__PRICE__', JSON.stringify(PRICE_PATTERN))})`,
)() as () => { priceRaw: string; renewalRaw: string; rawText: string };

const SELECT_SOURCE = String.raw`        const compact = (s) => (s||'').replace(/Đã bán hết|Đăng ký/g,'').replace(/\s+/g,' ').trim();
        const root=document.querySelector('.purchase-panel')||document.querySelector('[role="dialog"]')||document.querySelector('main,[role="main"]')||document.body;
        for(const control of root.querySelectorAll('[data-testid^="payment-sku-month-option-"]'))control.parentElement.setAttribute('data-option-group','Thời hạn');
        for(const control of root.querySelectorAll('[data-testid^="payment-sku-screen-option-"]'))control.parentElement.setAttribute('data-option-group','Chọn loại');
        if(label==='Tự động gia hạn') {
          const toggle=root.querySelector('[data-testid="payment-sku-details-auto-renewal"] [role="switch"], [data-testid="payment-sku-details-auto-renewal"] input[type="checkbox"]');
          if(!toggle)return false;
          const on=toggle.getAttribute('aria-checked')==='true'||toggle.checked===true;
          if(on!==(value==='Bật')){toggle.click();return 2;}
          return true;
        }
        const areas=Array.from(root.querySelectorAll('fieldset,[role="radiogroup"],[data-option-group],[class*="sku-group" i],[class*="period-group" i],[class*="plan-options" i]'));
        const area=areas.find((el,i)=>(compact(el.getAttribute('data-option-group')||el.getAttribute('aria-label')||el.querySelector('legend,[data-option-label],h3,h4')?.textContent)||'Option '+(i+1)) === label);
        if(!area)return false;
        const control=Array.from(area.querySelectorAll('button,[role="radio"],input[type="radio"],select option')).find(el=>compact(el.getAttribute('data-value')||el.getAttribute('aria-label')||(el instanceof HTMLInputElement?(el.labels?.[0]?.textContent||el.value):el.textContent))===value);
        if(!control||control.getAttribute('aria-disabled')==='true'||('disabled' in control&&control.disabled))return false;
        if(control.getAttribute('aria-checked')==='true'||control.checked===true)return true;
        if(control instanceof HTMLOptionElement){const select=control.closest('select');select.value=control.value;select.dispatchEvent(new Event('change',{bubbles:true}));}else control.click();
        return 2;
`;
const selectFn = new Function(
  'return (({label,value}) => {\n' + SELECT_SOURCE + '\n})',
)() as (input: { label: string; value: string }) => boolean | 2;
export async function collectVariants(
  page: Page,
  cfg: GamsgoConfig,
  url: string,
  currency: string | null,
): Promise<{ variants: VariantQuote[]; coverage: Coverage }> {
  let groups = await page.evaluate(groupsFn);
  if (!groups.length && /\/vi\/(shop|product)\//.test(url)) {
    const total = page.locator('.info-list-item').filter({ has: page.locator('dt', { hasText: /Tổng cộng|Total/i }) }).locator('dd .ui-price').first();
    const price = parsePrice(await total.textContent().catch(() => '') || '', currency, 'detail');
    const title = await page.locator('h1').first().textContent().catch(() => '');
    if (price?.amount != null && price.currency && title) return {
      variants: [{ sourceId: createHash('sha256').update(url).digest('hex').slice(0,20),
        options: { 'Gói': title.trim() }, price, rawText: await total.textContent() || '', evidence: 'offer-detail', selectionVerified: true }],
      coverage: { kind: 'offer', complete: true, reasons: [], pagesVisited: 1 },
    };
  }
  if (!groups.length && !cfg.offlineHtml) {
    await page.locator('.purchase-panel [role="radiogroup"]').first().waitFor({ state: 'attached', timeout: 8000 }).catch(() => undefined);
    groups = await page.evaluate(groupsFn);
  }
  // Only opens the selection dialog, never submits checkout/payment.
  if (!groups.length) {
    const buy = page
      .getByText(/^(Mua ngay|Buy now|Chọn gói)$/i)
      .first();
    if (await buy.isVisible().catch(() => false)) {
      await buy.click();
      await page.waitForTimeout(cfg.offlineHtml ? 10 : cfg.variantSettleMs);
      groups = await page.evaluate(groupsFn);
    }
  }
  const variants: VariantQuote[] = [];
  const reasons: string[] = [];
  if (!groups.length) {
    reasons.push(
      'No selectable option groups detected; detail/listing price is not a complete SKU quote',
    );
    return {
      variants,
      coverage: {
        kind: 'subscription',
        complete: false,
        reasons,
        pagesVisited: 1,
      },
    };
  }
  const queue: Array<Record<string, string>> = [{}];
  const seen = new Set<string>();
  while (queue.length && seen.size < cfg.maxVariants) {
    const options = queue.shift()!;
    const signature = JSON.stringify(Object.entries(options).sort());
    if (seen.has(signature)) continue;
    seen.add(signature);
    let selected = true;
    for (const [label, value] of Object.entries(options)) {
      const liveCalculator = !cfg.offlineHtml && await page.locator('.purchase-panel').count() > 0;
      // This endpoint only calculates the displayed quote; it does not place an order.
      const calculation = liveCalculator ? page.waitForResponse(response =>
        new URL(response.url()).hostname === 'api.gamsgo2.com' &&
        new URL(response.url()).pathname === '/payment/calculate',
        { timeout: 12000 }).then(async response => {
          await response.finished(); return response.ok();
        }).catch(() => false) : null;
      const result = await page.evaluate(selectFn, { label, value });
      if (!result) {
        selected = false;
        break;
      }
      if (result === 2 && calculation && !await calculation) {
        reasons.push(`Price calculation did not complete for ${signature}`);
        selected = false;
        break;
      }
      if (result === 2) await page.waitForTimeout(cfg.offlineHtml ? 10 : calculation ? Math.min(300, cfg.variantSettleMs) : cfg.variantSettleMs);
    }
    if (!selected) {
      reasons.push(`Option selection not available: ${signature}`);
      continue;
    }
    const current = await page.evaluate(groupsFn);
    const missing = current.find(group => !options[group.label]);
    if (missing) {
      for (const value of missing.values)
        queue.push({ ...options, [missing.label]: value });
      continue;
    }
    const mismatched = current.filter(group => group.selected && options[group.label] !== group.selected);
    if (mismatched.length) {
      reasons.push(`Selected UI state changed: ${signature}; observed ${JSON.stringify(mismatched.map(group => [group.label,group.selected]))}`);
      continue;
    }
    const raw = await page.evaluate(quoteFn);
    const price = parsePrice(raw.priceRaw, currency, 'detail');
    if (price?.amount === null || price?.amount === undefined || !price.currency)
      reasons.push(`Missing price/currency for ${signature}`);
    variants.push({
      sourceId: createHash('sha256')
        .update(url + '|' + signature)
        .digest('hex')
        .slice(0, 20),
      options,
      price,
      renewalPrice: parsePrice(raw.renewalRaw, currency, 'detail'),
      rawText: raw.rawText,
      evidence: 'selected-dom',
      selectionVerified: Boolean(cfg.offlineHtml) || current.every(group => group.selected !== undefined),
    });
  }
  if (queue.length) reasons.push('Variant exploration limit reached');
  if (!variants.length)
    reasons.push('No complete selectable combination captured');
  return {
    variants,
    coverage: {
      kind: 'subscription',
      complete: !reasons.length,
      reasons: [...new Set(reasons)],
      pagesVisited: 1,
    },
  };
}
