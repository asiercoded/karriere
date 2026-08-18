import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/lib/careers.json', 'utf-8')).careers;
let issues = [];

data.forEach(c => {
  let err = [];
  if (!c.real_experiences) {
    err.push('Missing real_experiences completely!');
  } else {
    c.real_experiences.forEach((q, i) => {
      if (q.quote.length < 25 || !q.quote.match(/[.!?"]$/)) {
        err.push(`Quote ${i+1}: "${q.quote}"`);
      }
    });
  }
  
  if (!c.metrics) {
    err.push('Missing metrics!');
  } else {
    if(c.metrics.misconception.length < 15) err.push(`Misconception: "${c.metrics.misconception}"`);
    if(c.metrics.regret.length < 15) err.push(`Regret: "${c.metrics.regret}"`);
    if(c.metrics.praise.length < 15) err.push(`Praise: "${c.metrics.praise}"`);
  }
  
  if (err.length > 0) {
    issues.push({ id: c.id, err });
  }
});

fs.writeFileSync('scratch/bad_quotes.txt', JSON.stringify(issues, null, 2));
console.log('Issues found:', issues.length);
