// Finds Tailwind classes written in src/ that Tailwind never emitted a rule for —
// usually a value outside the scales in tailwind.config.ts (spacing has no 5, 7, 10, 20).
// Such a class fails silently: the markup looks right, the style is simply absent.
//
//   npm run audit:classes          suspects that look like utilities
//   npm run audit:classes -- --all every unmatched token, including obvious non-classes

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const src = join(root, 'src');
const all = process.argv.includes('--all');

// ---- 1. compile the stylesheet, then collect every class Tailwind emitted ----

const cssPath = join(tmpdir(), 'frontdesk-audit-classes.css');
const bin = join(root, 'node_modules/.bin/tailwindcss');
execFileSync(existsSync(bin) ? bin : 'npx', [
  ...(existsSync(bin) ? [] : ['tailwindcss']),
  '-i', join(root, 'src/styles/index.css'),
  '-o', cssPath,
], { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] });

const emitted = new Set();
for (const raw of readFileSync(cssPath, 'utf8').split('\n')) {
  const line = raw.trim();
  if (!line.endsWith('{')) continue;
  for (const selector of line.slice(0, -1).split(/,(?![^[]*])/)) {
    const s = selector.trim();
    if (!s.startsWith('.')) continue;
    let name = '';
    for (let i = 1; i < s.length; i++) {
      const c = s[i];
      // Tailwind escapes specials as \x and non-ASCII as a \<hex> code point.
      if (c === '\\') {
        const hex = /^\\([0-9a-f]{1,6}) ?/i.exec(s.slice(i));
        if (hex) {
          name += String.fromCodePoint(parseInt(hex[1], 16));
          i += hex[0].length - 1;
        } else {
          name += s[++i];
        }
        continue;
      }
      if (':.,{ >[+~'.includes(c)) break;
      name += c;
    }
    if (name) emitted.add(name);
  }
}

// ---- 2. collect every class-shaped token written in src/ ----

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(p)) files.push(p);
  }
})(src);

// Utility families this project uses. Anything outside them needs --all to surface.
const utility = new RegExp(
  '^-?(?:[a-z0-9-]+:)*(?:' +
  'h|w|min-h|min-w|max-h|max-w|size|basis|' +
  'p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y|' +
  'top|left|right|bottom|inset|inset-x|inset-y|translate-x|translate-y|scale|rotate|' +
  'text|bg|border|border-t|border-b|border-l|border-r|border-x|border-y|divide-x|divide-y|' +
  'rounded|rounded-t|rounded-b|rounded-l|rounded-r|ring|ring-offset|outline|fill|stroke|' +
  'font|leading|tracking|indent|decoration|opacity|shadow|z|order|' +
  'grid-cols|grid-rows|col-span|row-span|duration|delay|ease|animate' +
  ')-',
);

const suspects = new Map();
for (const file of files) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (/^\s*(?:import|export)\b.*\bfrom\b/.test(line)) return; // module specifiers
    for (const m of line.matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`\n]*)`/g)) {
      for (const token of (m[1] ?? m[2] ?? m[3] ?? '').split(/\s+/)) {
        if (!token || emitted.has(token)) continue;
        if (!/^[a-z0-9:[\]/.,%#()_-]+$/i.test(token)) continue;
        if (!(all ? /[-[]/.test(token) : utility.test(token))) continue;
        if (!suspects.has(token)) suspects.set(token, new Set());
        suspects.get(token).add(`${file.replace(root, '')}:${i + 1}`);
      }
    }
  });
}

// ---- 3. report ----

if (suspects.size === 0) {
  console.log('audit-classes: no dead classes in src/');
  process.exit(0);
}

console.log(`audit-classes: ${suspects.size} token(s) with no matching rule\n`);
for (const [token, where] of [...suspects].sort()) {
  console.log(`  ${token.padEnd(30)} ${[...where].join(', ')}`);
}
console.log(
  '\nNot every line is a bug — a plain string that happens to look like a class' +
  '\n(a filename, a label, a mock value) lands here too. Check each against' +
  '\nthe scales in tailwind.config.ts before changing anything.',
);
