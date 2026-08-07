const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('./careers.json', 'utf8'));
  const careers = data.careers;
  const categories = data._metadata.categories;
  
  let errors = 0;
  const careerIds = new Set(careers.map(c => c.id));

  careers.forEach(c => {
    // Structural
    if (!c.id) { console.error('Missing id on a career'); errors++; }
    if (!c.name) { console.error(`Missing name for ${c.id}`); errors++; }
    if (!categories.includes(c.category)) { console.error(`Invalid category '${c.category}' for ${c.id}`); errors++; }
    
    // Parsed Data
    if (!c.salary_parsed || !c.salary_parsed.entry || !c.salary_parsed.mid || !c.salary_parsed.senior) {
      console.error(`Missing or malformed salary_parsed for ${c.id}`); errors++;
    }
    if (typeof c.duration_parsed !== 'number') {
      console.error(`Missing or invalid duration_parsed for ${c.id}`); errors++;
    }

    // Metrics bounds
    if (c.metrics) {
      ['stress', 'competition', 'salary_potential', 'study_difficulty', 'work_life_balance', 'job_availability', 'abroad_prospects'].forEach(m => {
        const val = c.metrics[m];
        if (typeof val !== 'number' || val < 1 || val > 5) {
          console.error(`Metric '${m}' out of bounds (1-5) or missing for ${c.id}`);
          errors++;
        }
      });
    }

    // Related careers
    if (c.related_careers) {
      c.related_careers.forEach(r => {
        if (!careerIds.has(r)) {
          console.error(`Invalid related_career '${r}' in ${c.id}`);
          errors++;
        }
      });
    }
    
    // Career Paths
    if (c.career_paths) {
      c.career_paths.forEach(p => {
        if (!['most_graduates', 'common', 'some', 'few'].includes(p.likelihood)) {
          console.error(`Invalid path likelihood '${p.likelihood}' for ${c.id}`);
          errors++;
        }
        if (!p.time_parsed) {
          console.error(`Missing time_parsed for path in ${c.id}`);
          errors++;
        }
      });
    }
  });

  if (errors > 0) {
    console.error(`Validation failed with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('careers.json validation passed!');
  }
} catch (e) {
  console.error('Failed to parse or validate careers.json:', e);
  process.exit(1);
}
