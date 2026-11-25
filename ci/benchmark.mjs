import { renderSite } from './render-site.mjs';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [planPath, site, timer] = process.argv.slice(2);
const { jobs, seen, tip } = JSON.parse(readFileSync(planPath));
if (!jobs.length) throw Error('Empty benchmark plan');
const statePath = join(site, 'state.json');
const measured = existsSync(statePath) ? JSON.parse(readFileSync(statePath)).measured : {};
const cpu = readFileSync('/proc/cpuinfo','utf8').match(/^model name\s*:\s*(.+)$/m)?.[1];
const run = { time: new Date().toISOString(), commit: process.env.GITHUB_SHA, cpu,
  runner: process.env.ImageVersion, jobs, results: [] };
const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
const imageFor = (name, v) => ({
  gcc: 'gcc:' + v, node: 'node:' + v, python: 'python:' + v,
  pypy: 'pypy:' + v, php: 'php:' + v + '-cli', perl: 'perl:' + v,
  'eclipse-temurin': 'eclipse-temurin:' + v + '-jdk', cython: 'python:3.12.12-bookworm',
})[name];
for (const { name, version, previous } of jobs) {
  for (const v of [previous, version].filter(Boolean)) {
    if (run.results.some(row => row.name === name && row.version === v)) continue;
    const image = imageFor(name, v);
    console.log('Benchmarking', name, v, image);
    docker('pull', image);
    const digest = docker('image', 'inspect', '--format', '{{index .RepoDigests 0}}', image).trim();
    const output = docker('run', '--rm', '-v', resolve('euler-problem12') + ':/src:ro',
      '-v', resolve('ci/run.sh') + ':/run-benchmark:ro', '-v', resolve(timer) + ':/bench-time:ro',
      digest, 'bash', '/run-benchmark', name, v);
    const variants = new Map();
    for (const line of output.split('\n').filter(s => s.startsWith('SAMPLE '))) {
      const [, variant, seconds, rss] = line.split(' ');
      if (!(Number(seconds) > 0 && Number(rss) > 0)) throw Error('Invalid sample: ' + line);
      if (!variants.has(variant)) variants.set(variant, []);
      variants.get(variant).push({ seconds: Number(seconds), peakKiB: Number(rss) });
    }
    if (!variants.size) throw Error('Missing results: ' + image);
    for (const [variant, samples] of variants) {
      if (samples.length !== 3) throw Error('Incomplete trials: ' + variant);
      run.results.push({ name, variant, version: v, image: digest, samples });
    }
    // Hosted runners have limited free space. Do not keep images between versions.
    docker('image', 'rm', image);
  }
  (measured[name] ??= []).push(version);
}
const history = join(site, 'runs');
mkdirSync(history, { recursive: true });
const id = process.env.GITHUB_RUN_ID + '-' + process.env.GITHUB_RUN_ATTEMPT;
writeFileSync(join(history, id + '.json'), JSON.stringify(run, null, 2));
renderSite(site);
writeFileSync(statePath, JSON.stringify({ tip, seen, measured }, null, 2));
