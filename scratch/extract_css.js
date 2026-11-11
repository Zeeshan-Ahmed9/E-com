const fs = require('fs');

const html = fs.readFileSync('scratch/zuu.html', 'utf8');

// Find all style tags and look for .pm- CSS rules
const styleBlocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);

let pmStyles = '';
for (const s of styleBlocks) {
  if (s.includes('pm-hero') || s.includes('pm-btn') || s.includes('pm-trust') || s.includes('.pm-')) {
    pmStyles += s + '\n';
  }
}

fs.writeFileSync('scratch/pm_styles.css', pmStyles);
console.log('Saved pm_styles.css, length:', pmStyles.length);

// Also look for external css files linked that might contain the custom styles
const links = [...html.matchAll(/<link[^>]+href="([^"]+\.css[^"]*)"/g)].map(m => m[1]);
console.log('Linked CSS files:', links.slice(0, 10));

