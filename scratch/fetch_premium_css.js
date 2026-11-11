const fs = require('fs');

async function downloadCss() {
  const res = await fetch('https://zuucollection.store/cdn/shop/t/3/assets/premium.css');
  const css = await res.text();
  fs.writeFileSync('scratch/premium.css', css);
  console.log('Saved premium.css, size:', css.length);

  // Extract key color codes and rules
  const hexColors = [...new Set(css.match(/#[0-9a-fA-F]{3,8}\b/g))];
  console.log('Hex colors in premium.css:', hexColors);

  // Print first 2000 chars of premium.css
  console.log('\n--- TOP OF PREMIUM.CSS ---');
  console.log(css.slice(0, 2000));
}

downloadCss().catch(console.error);

