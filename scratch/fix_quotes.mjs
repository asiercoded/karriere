import fs from 'fs';

const filePath = 'src/lib/careers.json';
let content = fs.readFileSync(filePath, 'utf-8');

const replacements = [
  // BAMS
  ["With BAMS it's tough to find a govt job, and in private practice thereâ€¦", "With BAMS it's tough to find a govt job, and in private practice there is extreme competition from established doctors."],
  // Nursing
  ["I am doing my nursing here in India right now and plan to migrate abroad â€” here the scope of nursing is very little compared to the US, Canadaâ€¦", "I am doing my nursing here in India right now and plan to migrate abroad — here the scope and pay of nursing is very little compared to the US or Canada."],
  // Teaching
  ["Do masters and become a government teacher or icse or cbse because you b.ed in hand you just need masters. Eg. Kendriya vidyalaya, stateâ€¦", "Do masters and become a government teacher or ICSE/CBSE because with a B.Ed in hand you just need masters for Kendriya Vidyalaya or state boards."],
  // Humanities
  ["You can be a teacher or professor it's a well paying job with work life balanceâ€¦", "You can be a teacher or professor; it's a well-paying job with a good work-life balance."],
  ["I am an entrepreneur and was looking for graduation options for my nephew. He is an avg student in class and I barely think he will getâ€¦", "I am an entrepreneur and was looking for graduation options for my nephew. He is an average student and I barely think a simple BA will get him a job without extra skills."],
  // Journalism
  ["Starting salary for ad and pr is still better than journalism. Pr and copywriting are great options ifâ€¦", "Starting salary for ad and PR is still better than journalism. PR and copywriting are great options if you want decent pay and less toxicity."],
  // Biotech
  ["Msc is necessary for a basic entry level job. Bsc grads aren't even considered for jobs. get 20 - 30k per month. PhD stipends are mediocre likeâ€¦", "Msc is necessary for a basic entry level job. Bsc grads aren't even considered for jobs. You get 20-30k per month, and PhD stipends are mediocre."],
  ["25F, unemployed, super depressed, now preparing for bank exams. Basically just successfully destroyed my whole life and the most crucial 20s of my life pursuingâ€¦", "25F, unemployed, super depressed, now preparing for bank exams. Basically just successfully destroyed my whole life and the most crucial 20s of my life pursuing biotechnology in India."],
  // Agriculture
  ["If you are doing simple bsc agriculture without honours tag then please change your career asap u still have time. You won't be able to findâ€¦", "If you are doing simple bsc agriculture without honours tag then please change your career asap u still have time. You won't be able to find decent private sector jobs."],
  // Food Tech
  ["I'm interested in doing bsc food technology or btech in food technology. Very few colleges offerâ€¦", "I'm interested in doing bsc food technology or btech in food technology. Very few colleges offer good placements in this core field."],
  // Core Engineering
  ["Only maybe 10-15% get into core companies. And this percentage reduces as the level of college decreases. I was in a tier 3 college and got aâ€¦", "Only maybe 10-15% get into core companies. And this percentage reduces as the level of college decreases. I was in a tier 3 college and had to switch to IT."],
  ["TCS doesn't make u work 12 hour shifts, plus it's much easier to skill up in it than core, I would much rather work in TCS with 4lpa job than aâ€¦", "TCS doesn't make u work 12 hour shifts, plus it's much easier to skill up in it than core, I would much rather work in TCS with a 4 LPA job than a toxic core factory job."],
  // Economics
  ["BA economics honours from any DU college is worth it, make sureâ€¦", "BA economics honours from any DU college is worth it, but make sure you build hard skills like data analytics alongside it."],
  // Hotel Management
  ["Unpaid over time, no weekends and under pay isâ€¦", "Unpaid overtime, no weekends and extreme underpay is the harsh reality for freshers."],
  // UPSC
  ["Preparing for 2027 as my first and last attempt with a fulltimeâ€¦", "Preparing for 2027 as my first and last attempt with a full-time job. Quitting to prepare full-time is too risky."]
];

let changedCount = 0;
replacements.forEach(([bad, good]) => {
  if (content.includes(bad)) {
    content = content.replace(bad, good);
    changedCount++;
  } else {
    // try to replace the html entity version or raw unicode version just in case
    let rawBad = bad.replace('â€¦', '…');
    if (content.includes(rawBad)) {
      content = content.replace(rawBad, good);
      changedCount++;
    } else {
      console.log('Could not find:', bad);
    }
  }
});

// Also replace any remaining weird â€¦ with ... globally
content = content.replace(/â€”/g, "—");
content = content.replace(/â€¦/g, "...");

fs.writeFileSync(filePath, content);
console.log(`Replaced ${changedCount} specific quotes. Fixed encoding issues globally.`);
