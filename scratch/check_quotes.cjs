const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/lib/careers.json', 'utf-8')).careers;
let output = '';
data.forEach(c => {
  let issues = [];
  c.realExperiences.forEach((q, i) => {
    if (q.quote.length < 20 || q.quote.match(/ (to|and|the|of|a|in|for|is|are|it|that|with)\s*$/i) || !q.quote.match(/[.!?"]$/)) {
      issues.push(`Quote ${i+1}: "${q.quote}"`);
    }
  });
  if (c.metrics.misconception.length < 10) issues.push(`Misconception: "${c.metrics.misconception}"`);
  if (c.metrics.regret.length < 10) issues.push(`Regret: "${c.metrics.regret}"`);
  if (c.metrics.praise.length < 10) issues.push(`Praise: "${c.metrics.praise}"`);
  
  if (issues.length > 0) {
    output += `\n--- ${c.id} ---\n` + issues.join('\n') + '\n';
  }
});
fs.writeFileSync('scratch/bad_quotes.txt', output || 'All good!');
console.log('Done!');
