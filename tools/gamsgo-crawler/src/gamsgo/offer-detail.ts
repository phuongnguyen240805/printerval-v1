import type { Page } from 'playwright';

const extract = new Function(`return (() => {
 const compact=s=>(s||'').replace(/\\s+/g,' ').trim();
 const details=document.querySelector('.sd.detail-item');
 const lines=(details?.innerText||'').split(/\\n/).map(compact).filter(Boolean);
 const attributes={};
 for(const [field,label] of Object.entries({duration:'Thời lượng',sharing:'Phương thức chia sẻ',devices:'Thiết bị được hỗ trợ'})){
   const index=lines.indexOf(label);if(index>=0&&lines[index+1])attributes[field]=lines[index+1];
 }
 for(const row of document.querySelectorAll('.detail-right .info-list-item')){
   const label=compact(row.querySelector('dt')?.textContent),value=compact(row.querySelector('dd')?.textContent);
   if(/Thời gian giao/i.test(label))attributes.delivery=value;
   if(/Bảo hành/i.test(label))attributes.warranty=value;
 }
 const buy=[...document.querySelectorAll('.settle button')].find(button=>/^Mua ngay$/i.test(compact(button.textContent)));
 if(buy)attributes.availability=buy.disabled||buy.getAttribute('aria-disabled')==='true'?'Không thể đặt mua':'Cho phép đặt mua';
 const description=document.querySelector('.description-card');
 return {attributes,description:description?.innerText||'',descriptionHtml:description?.innerHTML||''};
})`)() as () => { attributes: Record<string,string>; description: string; descriptionHtml: string };

export const extractOfferDetail = (page: Page) => page.evaluate(extract);
