const puppeteer = require('puppeteer');

(async () => {
  const path = process.argv[2] || '/careers/bds';
  const url = `http://localhost:4173${path}`;
  console.log(`Checking URL: ${url}`);
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto(url, { waitUntil: 'networkidle0' });
  
  // Look for the Vite error overlay
  const errorText = await page.evaluate(() => {
    const overlay = document.querySelector('vite-error-overlay');
    if (overlay) {
      return overlay.shadowRoot.innerHTML;
    }
    
    // Look for our custom Error Dialog
    const dialog = document.querySelector('[role="dialog"]');
    if (dialog && dialog.textContent.includes('Runtime Error')) {
      return dialog.textContent;
    }
    
    return null;
  });

  if (errorText) {
    console.log('FOUND ERROR OVERLAY:');
    console.log(errorText.substring(0, 500));
  } else {
    console.log('No error overlay found.');
  }

  await browser.close();
})();
