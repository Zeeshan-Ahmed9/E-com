const fs = require('fs');

const css = fs.readFileSync('scratch/premium.css', 'utf8');

function showMatch(regex) {
  const m = css.match(regex);
  if (m) console.log(m[0]);
}

console.log('--- .pm-btn ---');
showMatch(/\.pm-btn\{[\s\S]*?\}/);
showMatch(/\.pm-btn\.is-main\{[\s\S]*?\}/);

console.log('\n--- .pm-chips ---');
showMatch(/\.pm-chips\{[\s\S]*?\}/);
showMatch(/\.pm-chips\s+span\{[\s\S]*?\}/);

console.log('\n--- .pm-col / .pm-col-g ---');
showMatch(/\.pm-col-g\{[\s\S]*?\}/);
showMatch(/\.pm-col\{[\s\S]*?\}/);
showMatch(/\.pm-col\s+span\{[\s\S]*?\}/);

console.log('\n--- .pm-ticker ---');
showMatch(/\.pm-ticker[\s\S]*?\{[\s\S]*?\}/);

console.log('\n--- .pm-flash ---');
showMatch(/\.pm-flash[\s\S]*?\{[\s\S]*?\}/);

console.log('\n--- .pm-burst ---');
showMatch(/\.pm-burst\{[\s\S]*?\}/);

