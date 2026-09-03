const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('.convex.cloud/api/query') || url.includes('sync')) {
      // It's websocket or post request
      try {
        const text = await response.text();
        console.log(`[CONVEX RES] ${url}:`, text);
      } catch (e) {}
    }
  });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('Navigating to prod...');
  await page.goto('https://karrierehq.pages.dev/careers/bds', { waitUntil: 'networkidle0' });
  console.log('Done waiting.');
  
  await browser.close();
})();
