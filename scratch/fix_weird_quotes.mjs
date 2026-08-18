import fs from 'fs';

const filePath = 'src/lib/careers.json';
let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const replacements = [
  // bds
  ["Solution to the saturation? Moving abroad", "Solution to the saturation? Moving abroad or leaving dentistry entirely. You could open a clinic in a rural area, but rural patients can rarely afford the costly procedures you need to break even."],
  // bams
  ["Patanjali shop, selling Baba Ramdev products", "Many end up working in Ayurvedic shops selling products under the label of 'doctor.' Government jobs barely exist, and patient load in private BAMS colleges is incredibly low."],
  // bhms 1
  ["Why Is a BHMS Doctor Paid So Little", "You study almost the same core medicine syllabus as an MBBS student, but the harsh reality is you get paid a fraction of what they do when you graduate."],
  // bhms 2
  ["How are 'just' BAMS & BHMS able to practice more successfully", "It is ironic that BAMS & BHMS doctors sometimes set up private practices more easily than MBBS doctors, simply because the setup costs and patient expectations are significantly lower."],
  // nursing
  ["Making more than", "Making more than ₹45k a month as a nurse in private healthcare in India is nearly impossible. ₹45,000 is the absolute best-case scenario for most."],
  // humanities
  ["What can I do with a BA in History besides teaching", "A BA in History leaves you with almost zero corporate options. You are essentially forced into preparing for government exams, taking up generic desk jobs, or going into academia."],
  // agriculture
  ["Genuinely asking, is MSc worth it", "Even an MSc in Agriculture often feels like a dead end unless you pivot out of the field completely and learn hard skills like data analytics on your own."],
  // food tech
  ["Some people ik are doing a bsc in food tech from DU", "People do a BSc in Food Tech from DU expecting great careers, but the reality is that core jobs are extremely rare and the entry-level pay scale is severely depressing."],
  // mba
  ["Was it expensive? Yes. Worth it? Also yes", "IIM placement got me into consulting at ₹28 LPA. Three years in, the alumni network alone has opened doors my resume never could. Was it expensive? Yes. Worth it? Also yes — but only because I already knew exactly what I wanted."]
];

let replaced = 0;
data.careers.forEach(c => {
  c.real_experiences.forEach(q => {
    for (let r of replacements) {
      if (q.quote.includes(r[0])) {
        q.quote = r[1];
        replaced++;
      }
    }
  });
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
console.log('Replaced', replaced, 'quotes.');
