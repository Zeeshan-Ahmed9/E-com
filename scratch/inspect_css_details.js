const fs = require('fs');

const css = fs.readFileSync('scratch/premium.css', 'utf8');

// Find classes and their declarations
function getBlock(name) {
  const idx = css.indexOf(name);
  if (idx === -1) return null;
  return css.slice(idx, idx + 1200);
}

console.log('--- .pm-hero-in ---');
console.log(getBlock('.pm-hero-in'));

console.log('\n--- .pm-pill / .pm-btn ---');
console.log(getBlock('.pm-pill'));

console.log('\n--- .pm-stack / .pm-mini / .pm-burst ---');
console.log(getBlock('.pm-stack'));

console.log('\n--- .pm-trust / .pm-tcard ---');
console.log(getBlock('.pm-trust'));

console.log('\n--- .pm-cols (COLLECTIONS) ---');
console.log(getBlock('.pm-cols'));

console.log('\n--- .pm-card (PRODUCT CARD) ---');
console.log(getBlock('.pm-card'));

console.log('\n--- .pm-steps (HOW IT WORKS) ---');
console.log(getBlock('.pm-steps'));

