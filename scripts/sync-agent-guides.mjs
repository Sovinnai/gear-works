import {readFileSync,writeFileSync} from 'node:fs';
const source = new URL('../AGENTS.md', import.meta.url);
const target = new URL('../CLAUDE.md', import.meta.url);
const canonical = readFileSync(source, 'utf8');
const args = process.argv.slice(2);
if (args.length === 0) {
  writeFileSync(target, canonical);
} else if (args.length === 1 && args[0] === '--check') {
  if (readFileSync(target, 'utf8') !== canonical) {
    throw new Error('CLAUDE.md differs from AGENTS.md. Run node scripts/sync-agent-guides.mjs.');
  }
} else {
  throw new Error('Usage: node scripts/sync-agent-guides.mjs [--check]');
}
