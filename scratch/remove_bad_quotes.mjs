import fs from 'fs';

const filePath = 'src/lib/careers.json';
let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
let removedCount = 0;

data.careers.forEach(c => {
  let initialCount = c.real_experiences.length;
  c.real_experiences = c.real_experiences.filter(q => {
    const text = q.quote.toLowerCase();
    
    // Check for bad endings (truncated)
    if (q.quote.length < 25 || !q.quote.match(/[.!?"]$/)) {
      console.log('Removed (truncated):', q.quote);
      return false;
    }
    
    // Check for questions / out of place quotes
    if (text.includes('worth it') || text.includes('?') || text.includes('should i') || text.includes('is it')) {
      console.log('Removed (question):', q.quote);
      return false;
    }
    
    return true;
  });
  
  removedCount += (initialCount - c.real_experiences.length);
  
  if (c.real_experiences.length === 0) {
    console.log(`WARNING: ${c.id} has 0 quotes left!`);
  }
});

// Also replace the remaining weird â€” and â€¦ globally inside the json
let jsonString = JSON.stringify(data, null, 2);
jsonString = jsonString.replace(/â€”/g, "—").replace(/â€¦/g, "...");

fs.writeFileSync(filePath, jsonString);
console.log(`Removed ${removedCount} quotes entirely.`);
