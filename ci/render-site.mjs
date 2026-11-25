import { suite } from './suite.mjs';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const median = (samples, key) => samples.map(s => s[key]).sort((a, b) => a - b)[1];
const tracked = ['C', 'C++', 'Node', 'CPython', 'PyPy', 'PyPy-noJIT', 'PHP', 'Perl', 'Java', 'Cython', 'RustPython', 'Go', 'Rust'];

const repository = 'https://github.com/Yehonal/pl-benchmarks';
const extensions = { C: 'c', 'C++': 'cpp', Go: 'go', Rust: 'rs', Node: 'js', Java: 'java',
  CPython: 'py', PyPy: 'py', 'PyPy-noJIT': 'py', RustPython: 'py', PHP: 'php', Perl: 'perl' };

function implementationLink(row) {
  const extension = row.variant === 'Cython' ? (row.typedCython ? 'pyx' : 'py') : extensions[row.variant];
  if (!extension || !/^[a-f0-9]{40}$/.test(row.commit)) throw Error('Missing source for ' + row.variant);
  return '<a href="' + repository + '/blob/' + row.commit + '/euler-problem12/euler.' +
    extension + '">' + escape(row.variant) + '</a>';
}

function ranking(rows, showRun = false) {
  const sorted = rows.map(r => ({ ...r, seconds: median(r.samples, 'seconds'), kib: median(r.samples, 'peakKiB') }))
    .sort((a, b) => a.seconds - b.seconds || a.variant.localeCompare(b.variant));
  const body = sorted.map((r, i) => {
    const source = showRun ? '<td><a href="runs/' + r.file + '">' + escape(r.time.slice(0, 10)) + '</a></td>' : '';
    return '<tr><td>' + (i + 1) + '</td><th scope="row">' + implementationLink(r) + '</th><td>' + escape(r.version) +
      '</td><td>' + r.seconds.toFixed(3) + '</td><td>' + (r.kib / 1024).toFixed(1) + '</td>' + source + '</tr>';
  }).join('');
  return '<div class="scroll"><table><thead><tr><th>Rank</th><th>Runtime</th><th>Version</th><th>Time (s)</th><th>Peak RAM (MiB)</th>' +
    (showRun ? '<th>Run (UTC)</th>' : '') + '</tr></thead><tbody>' + body + '</tbody></table></div>';
}

export function renderSite(site) {
  const history = join(site, 'runs');
  const reports = readdirSync(history).filter(f => /^\d+-\d+\.json$/.test(f)).map(file => ({
    file, data: JSON.parse(readFileSync(join(history, file), 'utf8')),
  })).filter(({ data }) => data.suite === undefined || data.suite === suite)
    .sort((a, b) => b.data.time.localeCompare(a.data.time));
  for (const {data} of reports) {
    data.results = data.results.map(row => ({ ...row, commit: data.commit, typedCython: Boolean(data.suite) }));
  }
  const current = reports.filter(({ data }) => data.suite === suite);
  const reference = current.find(({ data }) => tracked.every(v => data.results.some(r => r.variant === v)));
  const latest = new Map();
  for (const {file, data} of current) {
    for (const row of data.results) {
      if (data.jobs.some(j => j.name === row.name && j.version === row.version) && !latest.has(row.variant)) {
        latest.set(row.variant, { ...row, file, time: data.time });
      }
    }
  }
  const source = ({ file, data }) => escape(data.time.slice(0, 10)) + ' UTC · ' + escape(data.cpu) + ' · <a href="runs/' + file + '">Raw measurements</a>';
  const referenceTable = reference ? '<p>' + source(reference) + '</p>' + ranking(reference.data.results) : '<p>Awaiting a complete comparison run.</p>';
  const historical = readFileSync(new URL('./historical-results.html', import.meta.url), 'utf8');
  const sections = reports.map(report => '<details><summary>' + escape(report.data.time) + ' · ' + escape(report.data.suite ?? 'original trial division') + '</summary><p>' + source(report) +
    '</p>' + ranking(report.data.results) + '</details>').join('');
  const html = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Euler 12 benchmark leaderboard</title><style>:root{color-scheme:light dark}body{font:1rem/1.5 system-ui;max-width:65rem;margin:auto;padding:1rem}table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}td,th{padding:.45rem .6rem;border-bottom:1px solid #8886;text-align:left;white-space:nowrap}.scroll{overflow-x:auto}summary{cursor:pointer;padding:.6rem 0}section{margin:2rem 0}</style>' +
    '<main><h1 id="leaderboard">Euler 12 leaderboard</h1><a href="' + repository + '">GitHub repository</a><p>Elapsed time includes process startup. Automated runs rank fastest first, using median elapsed time from three fresh processes. Peak RAM is the median peak RSS. Each run must return 842161320.</p>' +
    '<section><h2>Same-run ranking</h2><p>Original trial division: each triangular number is tested against every integer from 1 through its square root. All implementations on one runner in the most recent complete comparison.</p>' + referenceTable +
    '</section><section><h2>Latest release measurements</h2><p>Most recently benchmarked release per implementation. Dates and hosted hardware can differ between rows.</p>' +
    ranking([...latest.values()], true) + '</section><section><h2>Run history</h2>' + sections + '</section>' + historical + '</main></html>';
  writeFileSync(join(site, 'index.html'), html);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) renderSite(process.argv[2]);
