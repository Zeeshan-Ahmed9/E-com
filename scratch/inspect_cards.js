const fs = require('fs');

const html = fs.readFileSync('scratch/zuu.html', 'utf8');

// Look for product cards in the HTML
const cards = [...html.matchAll(/<div[^>]*class="[^"]*grid-view-item[^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/gi)];
console.log('Cards found:', cards.length);
if (cards.length > 0) {
  console.log('--- FIRST CARD ---');
  console.log(cards[0][0]);
}

// Check header style
const header = html.match(/<header[^>]*class="[^"]*"[^>]*>([\s\S]*?)<\/header>/i);
if (header) {
  console.log('\n--- HEADER ---');
  console.log(header[0].slice(0, 1000));
}

// Check top announcement ticker
const topAnn = html.match(/class="[^"]*top-header[^"]*"[\s\S]*?<\/div>/i) ||
               html.match(/class="[^"]*notification-bar[^"]*"[\s\S]*?<\/div>/i);
if (topAnn) {
  console.log('\n--- TOP BAR ---');
  console.log(topAnn[0]);
}

