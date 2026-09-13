const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('response', response => {
      if (!response.ok()) console.log('HTTP ERROR:', response.status(), response.url());
    });
    page.on('requestfailed', request => {
      console.log('REQUEST FAILED:', request.failure().errorText, request.url());
    });
    
    // Evaluate if there's any toast messages visible repeatedly
    await page.goto('http://localhost:5173/admin/dashboard', { waitUntil: 'networkidle2' });
    
    for (let i = 0; i < 5; i++) {
        const toasts = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('.go3958317564, .go2072408551, [role="status"]')).map(el => el.innerText);
        });
        console.log('VISIBLE TOASTS:', toasts);
        await new Promise(r => setTimeout(r, 1000));
    }
    
    await browser.close();
  } catch (err) {
    console.error('Puppeteer error:', err);
  }
})();
