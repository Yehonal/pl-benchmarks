import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Match immutable version numbers, excluding floating aliases and prereleases.
const tags = {
  gcc: /^(\d+\.\d+\.\d+)$/,
  node: /^(\d+\.\d+\.\d+)-bookworm$/,
  python: /^(\d+\.\d+\.\d+)-bookworm$/,
  pypy: /^(3\.\d+-\d+\.\d+\.\d+)-bookworm$/,
  php: /^(\d+\.\d+\.\d+)-cli$/,
  perl: /^(5\.\d+\.\d+)$/,
  'eclipse-temurin': /^((?:8u\d+-b\d+|\d+(?:\.\d+)*_\d+))-jdk-noble$/,
};
const order = new Intl.Collator('en', { numeric: true }).compare;
export function versions(name, manifest) {
  return [...new Set(manifest.split('\n').filter(line => line.startsWith('Tags: '))
    .flatMap(line => line.slice(6).split(', ')).map(tag => tags[name].exec(tag)?.[1])
    .filter(v => v && (name !== 'perl' || Number(v.split('.')[1]) % 2 === 0)))].sort(order);
}

export function plan(catalogue, state) {
  const jobs = [];
  const seen = {};
  for (const [name, available] of Object.entries(catalogue)) {
    const before = state?.seen[name] ?? [];
    const candidates = state ? available.filter(v => !before.includes(v)) : available.slice(-1);
    const measured = [...(state?.measured[name] ?? [])];
    for (const version of candidates) {
      const older = measured.filter(v => order(v, version) < 0).sort(order);
      const previous = older.filter(v => v.split('.')[0] === version.split('.')[0]).at(-1) ?? older.at(-1);
      jobs.push({ name, version, previous: previous ?? null });
      measured.push(version);
    }
    seen[name] = [...new Set([...before, ...available])].sort(order);
  }
  return { jobs, seen };
}

if (process.argv[1]?.endsWith('/releases.mjs')) {
  const [site, upstream, output] = process.argv.slice(2);
  const statePath = join(site, 'state.json');
  const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath)) : null;
  const git = (...args) => execFileSync('git', ['-C', upstream, ...args], { encoding: 'utf8' }).trim();
  const tip = git('rev-parse', 'HEAD');
  const catalogue = {};
  for (const name of Object.keys(tags)) {
    const path = 'library/' + name;
    // Include intermediate manifests so successive releases between daily checks survive.
    const revisions = state ? git('rev-list', '--reverse', state.tip + '..' + tip, '--', path).split('\n').filter(Boolean) : [];
    const available = new Set();
    for (const rev of new Set([...revisions, tip])) {
      for (const version of versions(name, git('show', rev + ':' + path))) available.add(version);
    }
    if (!available.size) throw Error('No stable tags for ' + name);
    catalogue[name] = [...available].sort(order);
  }
  const response = await fetch('https://pypi.org/pypi/Cython/json');
  if (!response.ok) throw Error('PyPI HTTP ' + response.status);
  const { releases } = await response.json();
  catalogue.cython = Object.keys(releases).filter(v => /^\d+\.\d+\.\d+$/.test(v) && releases[v].some(f => !f.yanked)).sort(order);
  if (!catalogue.cython.length) throw Error('Empty Cython catalogue');
  const { jobs, seen } = plan(catalogue, state);
  writeFileSync(output, JSON.stringify({ tip, seen, jobs }));
  console.log(jobs.length ? jobs : 'No new stable versions.');
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, 'changed=' + Boolean(jobs.length) + '\n');
}
