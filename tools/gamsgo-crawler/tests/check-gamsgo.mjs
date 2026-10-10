import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const folder = 'output/gamsgo-fixture';
const read=name=>JSON.parse(readFileSync(`${folder}/${name}`,'utf8'));
const catalog=read('catalog.json');
const summary=read('summary.json').summary;
const products=read('products.json');
const checks = [
  ['AI product card discovery',()=>assert.equal(catalog.products.length,9)],
  ['Marketplace section discovery',()=>assert.equal(catalog.marketplaceOffers.length,2)],
  ['AI navigation links separated',()=>assert.equal(catalog.aiNavigation.length,25)],
  ['No menu/footer products',()=>assert.ok(!catalog.products.some(p=>['netflix','midjourney'].includes(p.slug)))],
  ['JPY currency is retained',()=>assert.equal(catalog.currency,'JPY')],
  ['Price number is normalized',()=>assert.equal(catalog.products.find(p=>p.slug==='cursor').price.amount,2840)],
  ['2 offline details captured',()=>assert.equal(products.length,2)],
  ['Details have sections',()=>assert.ok(products[0].sections.length>1)],
  ['Details have images',()=>assert.ok(products[0].images.length>0)],
  ['Details have UI plan options',()=>assert.ok(products[0].planOptions.length>0)],
  ['No crawl errors',()=>assert.equal(summary.errors,0)],
  ['2 successful details',()=>assert.equal(summary.succeeded,2)],
];
for(const [name,run] of checks) {run();console.log('PASS',name)}
console.log(`PASS ${checks.length}/${checks.length} GamsGo fixture assertions`);
