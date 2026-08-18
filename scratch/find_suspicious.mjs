import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/lib/careers.json', 'utf-8')).careers;
let suspicious = [];

data.forEach(c => {
  c.real_experiences.forEach((q, i) => {
    let text = q.quote.toLowerCase();
    if (text.includes('worth it') || text.includes('?') || text.includes('should i') || text.includes('is it')) {
      suspicious.push({ id: c.id, quote: q.quote, source: q.source });
    }
  });
});

fs.writeFileSync('scratch/suspicious_quotes.json', JSON.stringify(suspicious, null, 2));
console.log('Suspicious quotes found:', suspicious.length);
