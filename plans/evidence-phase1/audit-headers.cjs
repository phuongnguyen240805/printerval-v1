const fs = require('node:fs');
(async () => {
  const result = [];
  for (const url of ['https://placeit.net/mockups/print-on-demand', 'https://printerval.gofiber-phuongnguyen.workers.dev/create-your-own']) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      result.push({ url, finalUrl: response.url, status: response.status,
        headers: Object.fromEntries(['content-security-policy', 'x-frame-options', 'content-type'].map(key => [key, response.headers.get(key)])) });
      await response.body?.cancel();
    } catch (error) { result.push({ url, error: error.message }); }
  }
  fs.writeFileSync('plans/evidence-phase1/headers.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result.map(({url,status,error,headers}) => ({url,status,error,xfo:headers?.['x-frame-options'],frameAncestors:headers?.['content-security-policy']?.match(/frame-ancestors[^;]*/)?.[0]})), null, 2));
})();
