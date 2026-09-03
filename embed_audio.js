// embed_audio.js
// Node script to replace local .mp3 filenames in app.js with data URI base64-embedded audio
// Usage: node embed_audio.js

const fs = require('fs');
const path = require('path');

const cwd = __dirname;
const audioDir = path.join(cwd, 'File Mp3');
const appPath = path.join(cwd, 'app.js');
if (!fs.existsSync(appPath)) {
  console.error('app.js not found in', cwd);
  process.exit(1);
}
let app = fs.readFileSync(appPath, 'utf8');

// Find all track: 'filename.mp3' occurrences
const trackRegex = /track:\s*'([^']+?\.mp3)'/g;
let match;
const replaced = new Map();
while ((match = trackRegex.exec(app)) !== null) {
  const filename = match[1];
  if (replaced.has(filename)) continue;
  let filePath = path.join(cwd, filename);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(audioDir, filename);
  }
  if (!fs.existsSync(filePath)) {
    const candidates = fs.existsSync(audioDir)
      ? fs.readdirSync(audioDir).filter((entry) => entry.toLowerCase().endsWith('.mp3'))
      : [];
    const normalized = filename.toLowerCase().replace(/[^\w]+/g, '');
    const candidate = candidates.find((entry) => entry.toLowerCase().replace(/[^\w]+/g, '').includes(normalized));
    if (candidate) filePath = path.join(audioDir, candidate);
  }
  if (!fs.existsSync(filePath)) {
    console.error('Warning: audio file not found:', filename);
    continue;
  }
  console.log('Embedding', filename);
  const data = fs.readFileSync(filePath);
  const b64 = data.toString('base64');
  const dataUri = `data:audio/mpeg;base64,${b64}`;
  replaced.set(filename, dataUri);
}

if (replaced.size === 0) {
  console.log('No matching MP3 filenames found in app.js. Nothing to do.');
  process.exit(0);
}

// Replace occurrences
for (const [filename, dataUri] of replaced.entries()) {
  // escape for use in replacement
  const esc = filename.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const rx = new RegExp(`track:\\s*'${esc}'`, 'g');
  app = app.replace(rx, `track: '${dataUri}'`);
}

const outPath = path.join(cwd, 'app.embedded.js');
fs.writeFileSync(outPath, app, 'utf8');
console.log('Wrote', outPath);
console.log('Now update index.html to load app.embedded.js instead of app.js, or rename app.embedded.js to app.js');
console.log('Note: resulting file sizes may be very large.');
