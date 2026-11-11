const fs = require('fs');
const https = require('https');

async function main() {
  const res = await fetch('https://zuucollection.store/');
  const html = await res.text();
  fs.writeFileSync('scratch/zuu.html', html);

  console.log('--- BASIC INFO ---');
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1];
  console.log('Title:', title);

  const themeMatch = html.match(/Shopify\.theme\s*=\s*({[^}]+})/);
  console.log('Theme:', themeMatch ? themeMatch[1] : 'Unknown');

  // Find all section names or template parts
  const sections = [...html.matchAll(/id="shopify-section-([^"]+)"/g)].map(m => m[1]);
  console.log('\n--- HOMEPAGE SECTIONS ---');
  console.log(sections);

  // Extract color definitions & styles
  console.log('\n--- COLOR DEFINITIONS ---');
  const colorMatches = [...html.matchAll(/--color-([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g)];
  const colors = {};
  for (const m of colorMatches) {
    colors[m[1]] = m[2].trim();
  }
  console.log('CSS Variables (--color-*):', colors);

  // Find announcement text
  console.log('\n--- ANNOUNCEMENT BAR ---');
  const ann = html.match(/announcement-bar[^>]*>([\s\S]*?)<\/section>/i) || html.match(/announcement[^\"]*\"[^>]*>([\s\S]*?)<\/div>/i);
  if (ann) {
    // Strip tags to get text
    console.log(ann[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  }

  // Find header details
  console.log('\n--- HEADER / NAVIGATION ---');
  const header = html.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
  if (header) {
    console.log(header[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500));
  }

  // Find hero / banner images & text
  console.log('\n--- BANNER / HERO ---');
  const banners = [...html.matchAll(/<div[^>]*class="[^"]*(?:banner|hero|slideshow)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)];
  for (const b of banners.slice(0, 3)) {
    console.log(b[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300));
  }

  // Find product card styling
  console.log('\n--- PRODUCTS SNIPPET ---');
  const card = html.match(/class="[^"]*card-wrapper[^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i) || html.match(/class="[^"]*product-card[^"]*"[\s\S]*?<\/div>/i);
  if (card) {
    console.log(card[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500));
  }

  // Find font families
  console.log('\n--- FONTS ---');
  const fontMatches = [...html.matchAll(/font-family\s*:\s*([^;]+);/g)].map(m => m[1].trim());
  console.log('Fonts found:', [...new Set(fontMatches)].slice(0, 10));
}

main().catch(console.error);

