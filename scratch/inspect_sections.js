const fs = require('fs');

const html = fs.readFileSync('scratch/zuu.html', 'utf8');

// 1. Look for custom-colors section
const customColors = html.match(/id="shopify-section-custom-colors"[\s\S]*?<\/style>/i) ||
                     html.match(/<style[^>]*id="[^"]*color[^"]*"[^>]*>([\s\S]*?)<\/style>/i);
console.log('--- CUSTOM COLORS ---');
if (customColors) {
  console.log(customColors[0].slice(0, 1000));
}

// 2. Look at pm_hero section
console.log('\n--- PM HERO SECTION ---');
const hero = html.match(/id="shopify-section-template--28188279210178__pm_hero"[\s\S]*?<\/section>/i) ||
             html.match(/class="[^"]*pm_hero[^"]*"[\s\S]*?<\/div>\s*<\/div>/i);
if (hero) {
  console.log(hero[0].slice(0, 1500));
}

// 3. Look at pm_ticker & pm_trust
console.log('\n--- PM TRUST SECTION ---');
const trust = html.match(/id="shopify-section-template--28188279210178__pm_trust"[\s\S]*?<\/section>/i);
if (trust) {
  console.log(trust[0].slice(0, 1000));
}

// 4. Look at header
console.log('\n--- HEADER SNIPPET ---');
const header = html.match(/id="shopify-section-navigation"[\s\S]*?<\/section>/i) ||
               html.match(/<header[\s\S]*?<\/header>/i);
if (header) {
  console.log(header[0].slice(0, 1500));
}

// 5. Look at how products are rendered (cards, prices, buttons)
console.log('\n--- PRODUCT CARD SNIPPET ---');
const prod = html.match(/<div[^>]*class="[^"]*(?:product-card|grid-view-item|item-card)[^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i) ||
             html.match(/class="[^"]*product[_-]card[^"]*"[\s\S]*?<\/div>/i);
if (prod) {
  console.log(prod[0].slice(0, 1200));
}

