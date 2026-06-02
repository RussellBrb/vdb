import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const vdbPath = resolve(root, 'vdb.js');
const lastRunPath = resolve(__dirname, 'last-run.json');
const vdbSource = await readFile(vdbPath, 'utf8');

const THEMES = [
  'twilight-forest',
  'under-the-sea',
  'sunrise',
  'synthwave',
  'crt',
  'chill',
  'blueprint',
];

const LIBRARY_THEMES = ['blueprint', 'sunrise', 'crt'];
const EXPECTED_CATALOG_ATOMS = 24;
const EXPECTED_RECIPES = 8;
const VARIANT_THEMES = ['blueprint', 'crt'];
const VARIANT_DEFAULTS = { size: 'md', density: 'comfortable', emphasis: 'normal', tone: 'neutral' };
const TONE_ROLES = ['good', 'warn', 'bad', 'info'];

const COMPONENTS = {
  gauge: { value: 72, label: 'health' },
  bars: { title: 'Load', items: [{ label: 'api', value: 68 }, { label: 'db', value: 0.42, note: '42%' }] },
  allocation: { title: 'Mix', items: [{ label: 'core', value: 55 }, { label: 'edge', value: 45 }] },
  sparkline: { title: 'Trend', points: [3, 8, 5, 13, 11, 18] },
  tiles: { items: [{ value: '12', label: 'open' }, { value: '4', label: 'risk' }] },
  pipeline: { title: 'Ship', items: [{ label: 'spec', state: 'done' }, { label: 'test', state: 'active' }, { label: 'tag', state: 'queued' }] },
  note: { text: 'Plain note text.' },
  focal: { value: '98%', label: 'uptime', sub: 'last 24h' },
  scene: { height: 90, motif: 'hills' },
  comparison: { title: 'Before / after', items: [{ label: 'latency', a: 84, b: 38, aNote: 'old', bNote: 'new' }] },
  cards: { items: [{ title: 'A', desc: 'baseline', tag: 'safe' }, { title: 'B', desc: 'candidate', tag: 'rec', rec: true }] },
  controls: {
    items: [
      { type: 'toggle', param: 'enabled', label: 'Enabled' },
      { type: 'slider', param: 'level', label: 'Level', min: 0, max: 10 },
      { type: 'select', param: 'mode', label: 'Mode', options: ['a', 'b'] },
      { type: 'button', label: 'Send', action: { prompt: 'mode {mode}' } },
    ],
  },
  button: { label: 'Send', action: { prompt: 'hello' } },
  callout: { text: 'Important callout.' },
  flow: { title: 'Flow', nodes: ['ingest', 'score', 'ship'] },
  nodes: {
    title: 'Graph',
    active: 'step',
    nodes: [{ id: 'a', label: 'A', col: 0, step: 1 }, { id: 'b', label: 'B', col: 1, step: 2 }],
    edges: [['a', 'b']],
  },
  mermaid: { key: 'mm-fixture', code: 'flowchart LR\n  A[Start] --> B[Done]' },
  stage: {
    active: 'step',
    parts: [{ label: 'Intake', step: 1 }, { label: 'Review', step: 2, note: 'Inspect this band.' }],
  },
  motion: { key: 'motion-fixture', preset: 'toggle', autoplay: false },
  diagram: {
    active: 'step',
    layers: [{ tag: 'A', label: 'Input', sub: 'raw', step: 1 }, { tag: 'B', label: 'Output', sub: 'ready', step: 2 }],
  },
  stepper: { param: 'step', steps: 3, labels: ['one', 'two', 'three'] },
  slider: { param: 'level', label: 'Level', min: 0, max: 10 },
  select: { param: 'mode', label: 'Mode', options: ['a', { value: 'b', label: 'B' }] },
  toggle: { param: 'enabled', label: 'Enabled' },
  tabs: { param: 'mode', options: ['a', { value: 'b', label: 'B' }] },
};

const BASE_STATE = { step: 1, level: 5, mode: 'a', enabled: true };
const NON_EMPTY_FLOOR = 24;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeHtml(html) {
  return html
    .replace(/vdbsky_\d+/g, 'vdbsky_ID')
    .replace(/vdbar_\d+/g, 'vdbar_ID')
    .replace(/vdbmm_\d+/g, 'vdbmm_ID')
    .replace(/vdbmo_\d+/g, 'vdbmo_ID')
    .replace(/data-vdb-btn="\d+"/g, 'data-vdb-btn="N"');
}

function hexToRgb(hex) {
  const m = String(hex).match(/^#([0-9a-f]{6})$/i);
  if (!m) return null;
  const n = Number.parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relLum(rgb) {
  return rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
}

function contrast(a, b) {
  const l1 = relLum(a);
  const l2 = relLum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function createRuntime() {
  const { window } = parseHTML('<!doctype html><html><head></head><body><main id="app"></main></body></html>');
  const errors = [];
  const logs = [];

  window.console = {
    log: (...args) => logs.push(args.map(String).join(' ')),
    warn: (...args) => logs.push(args.map(String).join(' ')),
    error: (...args) => errors.push(args.map(String).join(' ')),
  };
  window.setTimeout = setTimeout;
  window.clearTimeout = clearTimeout;
  window.setInterval = setInterval;
  window.clearInterval = clearInterval;
  window.CSS = { escape: (value) => String(value).replace(/["\\]/g, '\\$&') };
  window.open = () => {};

  vm.runInNewContext(vdbSource, window, { filename: 'vdb.js' });
  return { window, document: window.document, errors, logs, VDB: window.VDB };
}

function specFor(theme, component) {
  return {
    theme,
    title: `${component.type} fixture`,
    seed: 'harness',
    state: clone(BASE_STATE),
    animate: true,
    components: [clone(component)],
  };
}

async function settle() {
  await new Promise((resolveSettle) => setTimeout(resolveSettle, 10));
}

async function renderOnce(theme, type) {
  const runtime = createRuntime();
  const target = runtime.document.getElementById('app');
  const component = { type, ...clone(COMPONENTS[type]) };
  const spec = specFor(theme, component);

  let exception = null;
  try {
    runtime.VDB(target, spec);
    await settle();
  } catch (error) {
    exception = error;
  }

  const html = target.innerHTML || '';
  return { runtime, target, spec, html, exception };
}

async function renderSpec(spec) {
  const runtime = createRuntime();
  const target = runtime.document.getElementById('app');
  let exception = null;
  try {
    runtime.VDB(target, spec);
    await settle();
  } catch (error) {
    exception = error;
  }
  return { runtime, target, html: target.innerHTML || '', exception };
}

async function checkRender(theme, type) {
  const failures = [];
  const result = await renderOnce(theme, type);

  if (result.exception) failures.push(`exception: ${result.exception.message}`);
  if (result.runtime.errors.length) failures.push(`console.error: ${result.runtime.errors.join(' | ')}`);
  if (result.html.length < NON_EMPTY_FLOOR) failures.push(`empty render: innerHTML length ${result.html.length}`);

  try {
    const before = normalizeHtml(result.target.innerHTML);
    result.runtime.VDB(result.target, result.spec);
    await settle();
    const after = normalizeHtml(result.target.innerHTML);
    if (before !== after) failures.push('idempotent re-render changed normalized DOM');
  } catch (error) {
    failures.push(`idempotent exception: ${error.message}`);
  }

  if (type === 'mermaid' || type === 'motion') {
    try {
      const keyedBefore = result.target.querySelector('[data-vkey]');
      result.runtime.VDB(result.target, result.spec);
      await settle();
      const keyedAfter = result.target.querySelector('[data-vkey]');
      if (!keyedBefore || !keyedAfter || keyedBefore !== keyedAfter) {
        failures.push('keyed node was not preserved across re-render');
      }
    } catch (error) {
      failures.push(`key preservation exception: ${error.message}`);
    }
  }

  return failures;
}

async function checkGracefulDegradation(type) {
  const runtime = createRuntime();
  const target = runtime.document.getElementById('app');
  let exception = null;
  try {
    runtime.VDB(target, { theme: 'blueprint', state: clone(BASE_STATE), components: [{ type }] });
    await settle();
  } catch (error) {
    exception = error;
  }
  const failures = [];
  if (exception) failures.push(`missing props exception: ${exception.message}`);
  if (runtime.errors.length) failures.push(`missing props console.error: ${runtime.errors.join(' | ')}`);
  return failures;
}

async function readJsonSpecs(dir) {
  const absDir = resolve(root, dir);
  const files = (await readdir(absDir)).filter((file) => file.endsWith('.json')).sort();
  const specs = [];
  for (const file of files) {
    specs.push({
      name: file.replace(/\.json$/, ''),
      file: `${dir}/${file}`.replace(/\\/g, '/'),
      spec: JSON.parse(await readFile(resolve(absDir, file), 'utf8')),
    });
  }
  return specs;
}

async function checkLibrarySpecs(kind, specs, expectedCount) {
  const rows = {};
  const red = [];
  if (specs.length !== expectedCount) {
    red.push({ kind, name: '*', theme: '*', failures: [`expected ${expectedCount} specs, found ${specs.length}`] });
  }

  for (const entry of specs) {
    rows[entry.name] = {};
    for (const theme of LIBRARY_THEMES) {
      const spec = { ...clone(entry.spec), theme };
      const result = await renderSpec(spec);
      const failures = [];
      if (result.exception) failures.push(`exception: ${result.exception.message}`);
      if (result.runtime.errors.length) failures.push(`console.error: ${result.runtime.errors.join(' | ')}`);
      if (result.html.length < NON_EMPTY_FLOOR) failures.push(`empty render: innerHTML length ${result.html.length}`);
      rows[entry.name][theme] = failures.length ? { ok: false, failures, file: entry.file } : { ok: true, failures: [], file: entry.file };
      if (failures.length) red.push({ kind, name: entry.name, theme, failures, file: entry.file });
    }
  }
  return { kind, expectedCount, actualCount: specs.length, themes: LIBRARY_THEMES, rows, red };
}

function variantSpec(type, overrides) {
  const component = { type, ...clone(COMPONENTS[type]), ...overrides };
  if (Array.isArray(component.items)) {
    component.items = component.items.map((item, index) => index === 0 ? { ...item, tone: 'bad', emphasis: 'strong' } : item);
  }
  return { theme: 'blueprint', title: `${type} variant`, state: clone(BASE_STATE), components: [component] };
}

async function checkDefaultEquivalence() {
  const failures = [];
  for (const type of Object.keys(COMPONENTS)) {
    const base = await renderSpec(specFor('blueprint', { type, ...clone(COMPONENTS[type]) }));
    const explicit = await renderSpec(specFor('blueprint', { type, ...clone(COMPONENTS[type]), ...VARIANT_DEFAULTS }));
    if (base.exception || explicit.exception) {
      failures.push(`${type}: exception during equivalence render`);
      continue;
    }
    if (normalizeHtml(base.html) !== normalizeHtml(explicit.html)) {
      failures.push(`${type}: explicit defaults changed normalized DOM`);
    }
  }
  return failures;
}

async function checkVariants() {
  const rows = {};
  const red = [];
  const variantTypes = ['focal', 'gauge', 'bars', 'tiles', 'pipeline', 'allocation', 'callout', 'cards', 'comparison', 'nodes', 'stage', 'diagram'];
  const samples = [
    { size: 'sm', density: 'compact', emphasis: 'muted', tone: 'good' },
    { size: 'lg', density: 'comfortable', emphasis: 'strong', tone: 'warn' },
    { size: 'bad-value', density: 'bad-value', emphasis: 'bad-value', tone: 'bad-value' },
  ];

  for (const type of variantTypes) {
    rows[type] = {};
    for (const theme of VARIANT_THEMES) {
      rows[type][theme] = [];
      for (const sample of samples) {
        const spec = variantSpec(type, sample);
        spec.theme = theme;
        const result = await renderSpec(spec);
        const failures = [];
        if (result.exception) failures.push(`exception: ${result.exception.message}`);
        if (result.runtime.errors.length) failures.push(`console.error: ${result.runtime.errors.join(' | ')}`);
        if (result.html.length < NON_EMPTY_FLOOR) failures.push(`empty render: innerHTML length ${result.html.length}`);
        if (sample.size !== 'bad-value' && !result.html.includes('vdb-var')) failures.push('missing shared variant wrapper');
        rows[type][theme].push(failures.length ? { ok: false, failures, sample } : { ok: true, failures: [], sample });
        if (failures.length) red.push({ type, theme, sample, failures });
      }
    }
  }
  return { themes: VARIANT_THEMES, rows, red };
}

function checkSemanticContrast() {
  const failures = [];
  const darkText = hexToRgb('#0a0a12');
  const runtime = createRuntime();
  for (const theme of THEMES) {
    const pal = runtime.VDB.palette(theme);
    for (const role of TONE_ROLES) {
      const rgb = hexToRgb(pal[role]);
      if (!rgb) failures.push(`${theme}/${role}: missing hex semantic color`);
      else if (contrast(rgb, darkText) < 4.5) failures.push(`${theme}/${role}: contrast below 4.5 against dark-on-fill text`);
    }
  }
  return failures;
}

function keyframeBlocks(css) {
  const blocks = [];
  const re = /@keyframes\s+[\w-]+\s*\{/g;
  let match;
  while ((match = re.exec(css))) {
    let depth = 1;
    let i = re.lastIndex;
    while (i < css.length && depth > 0) {
      if (css[i] === '{') depth += 1;
      else if (css[i] === '}') depth -= 1;
      i += 1;
    }
    blocks.push(css.slice(re.lastIndex, i - 1));
    re.lastIndex = i;
  }
  return blocks;
}

async function checkAnimations() {
  const red = [];
  const rows = {};
  const samples = {
    gear: { theme: 'blueprint', components: [{ type: 'motion', preset: 'gear', params: { teethA: 24, teethB: 12, period: 1200 }, key: 'gear-check' }] },
    piston: { theme: 'crt', components: [{ type: 'motion', preset: 'piston', params: { radius: 32, period: 1400 }, key: 'piston-check' }] },
    behavior: {
      theme: 'blueprint',
      components: [{
        type: 'motion',
        width: 220,
        height: 120,
        parts: [
          { id: 'driver', shape: 'circle', x: 60, y: 60, r: 18, behaviors: [{ type: 'rotate', period: 900 }] },
          { id: 'follower', parent: 'driver', shape: 'circle', x: 28, y: 0, r: 6, behaviors: [{ type: 'pulse', prop: 'opacity', period: 900, phase: 0.08 }] },
          { id: 'flow', shape: 'circle', x: 130, y: 60, r: 5, behaviors: [{ type: 'flow', path: [[0, 0], [24, 0], [48, 12]], period: 900 }] },
        ],
      }],
    },
  };

  for (const [name, spec] of Object.entries(samples)) {
    const result = await renderSpec(spec);
    const failures = [];
    const html = result.html;
    const css = [...html.matchAll(/<style[^>]*data-vdb-behavior[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
    const blocks = keyframeBlocks(css);
    if (result.exception) failures.push(`exception: ${result.exception.message}`);
    if (result.runtime.errors.length) failures.push(`console.error: ${result.runtime.errors.join(' | ')}`);
    if (html.length < NON_EMPTY_FLOOR) failures.push(`empty render: innerHTML length ${html.length}`);
    if (!html.includes('data-principles="ease-in-out causal-140ms segmented-auto-pause"')) failures.push('missing principle defaults marker');
    if (!css.includes('@keyframes')) failures.push('missing compiled keyframes');
    if (!blocks.length) failures.push('no parseable keyframe blocks');
    for (const block of blocks) {
      const props = [...block.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
      const badProps = props.filter((prop) => prop !== 'transform' && prop !== 'opacity');
      if (badProps.length) failures.push(`keyframes include non-transform/opacity properties: ${badProps.join(',')}`);
    }
    if (/requestAnimationFrame|\.animate\(|<animate/.test(vdbSource) || /offset-path|offset-distance/.test(css)) failures.push('disallowed animation runtime/path primitive found');
    if (name === 'gear' && !css.includes('rotate(-720deg)')) failures.push('gear tooth ratio / opposite rotation not found');
    if (name === 'piston' && !css.includes('translateX(32px)')) failures.push('piston slider-crank x ~= r*cos(theta) oscillation not found');
    if (name === 'behavior' && !/<g data-pid="driver"[\s\S]*<g data-pid="follower"/.test(html)) failures.push('FK parent nesting not found');
    rows[name] = failures.length ? { ok: false, failures } : { ok: true, failures: [] };
    if (failures.length) red.push({ name, failures });
  }

  const base = await renderSpec({ theme: 'blueprint', components: [{ type: 'motion', preset: 'toggle', key: 'escape', autoplay: false }] });
  const explicit = await renderSpec({ theme: 'blueprint', components: [{ type: 'motion', preset: 'toggle', key: 'escape', autoplay: false, behaviors: [] }] });
  const eqFailures = [];
  if (base.exception || explicit.exception) eqFailures.push('exception during frame escape-hatch render');
  if (!base.html.includes('data-m=') || base.html.includes('data-vdb-behavior')) eqFailures.push('base frame path did not use data-m escape hatch');
  if (normalizeHtml(base.html) !== normalizeHtml(explicit.html)) eqFailures.push('empty behaviors changed legacy frame output');
  rows['frame-default-equivalence'] = eqFailures.length ? { ok: false, failures: eqFailures } : { ok: true, failures: [] };
  if (eqFailures.length) red.push({ name: 'frame-default-equivalence', failures: eqFailures });

  return { rows, red };
}

function checkContrastConventions() {
  const failures = [];
  if (!vdbSource.includes('color:#06070f')) {
    failures.push('diagram dark-on-fill convention #06070f not found');
  }
  if (!vdbSource.includes("primaryTextColor:'#0a0a12'") || !vdbSource.includes("nodeTextColor:'#0a0a12'")) {
    failures.push('mermaid dark-on-fill convention #0a0a12 not found');
  }
  return failures;
}

function checkHelperShadowing() {
  const helpers = ['h', 'esc', 'pct', 'C', '_sid'];
  const failures = [];
  const registryStart = vdbSource.indexOf('const C={');
  const registryEnd = vdbSource.indexOf('\n  };\n\n  const ATM=', registryStart);
  const registryBodyStart = registryStart + 'const C={'.length;
  const registry = registryStart >= 0 && registryEnd > registryStart ? vdbSource.slice(registryBodyStart, registryEnd) : '';
  for (const helper of helpers) {
    const pattern = new RegExp(`\\b(?:const|let|var)\\s+${helper}\\b`);
    if (pattern.test(registry)) failures.push(`helper shadowed inside component registry: ${helper}`);
  }
  return failures;
}

async function checkRegressions() {
  const regressions = [];

  const flowResult = await renderOnce('blueprint', 'flow');
  regressions.push({
    name: 'flow-title-helper-collision',
    ok: !flowResult.exception && flowResult.html.length >= NON_EMPTY_FLOOR,
    failures: [
      ...(flowResult.exception ? [`exception: ${flowResult.exception.message}`] : []),
      ...(flowResult.html.length < NON_EMPTY_FLOOR ? [`empty render: innerHTML length ${flowResult.html.length}`] : []),
    ],
  });

  const mermaidFailures = [];
  for (const theme of ['crt', 'blueprint']) {
    const result = await renderOnce(theme, 'mermaid');
    if (result.exception) mermaidFailures.push(`${theme}: ${result.exception.message}`);
  }
  mermaidFailures.push(...checkContrastConventions().filter((failure) => failure.includes('mermaid')));
  regressions.push({
    name: 'mermaid-node-contrast',
    ok: mermaidFailures.length === 0,
    failures: mermaidFailures,
  });

  return regressions;
}

async function cdnSmoke() {
  const url = 'https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v13/vdb.js';
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return { ok: response.status === 200, status: response.status, url };
  } catch (error) {
    return { ok: false, optional: true, error: error.message, url };
  }
}

const matrix = {};
const redCells = [];

for (const type of Object.keys(COMPONENTS)) {
  matrix[type] = {};
  const degradationFailures = await checkGracefulDegradation(type);
  for (const theme of THEMES) {
    const failures = await checkRender(theme, type);
    if (degradationFailures.length) failures.push(...degradationFailures);
    matrix[type][theme] = failures.length ? { ok: false, failures } : { ok: true, failures: [] };
    if (failures.length) redCells.push({ type, theme, failures });
  }
}

const globalChecks = [
  ...checkContrastConventions().map((failure) => ({ name: 'contrast-convention', failure })),
  ...checkHelperShadowing().map((failure) => ({ name: 'helper-shadowing', failure })),
];
const regressions = await checkRegressions();
const cdn = await cdnSmoke();
const catalogSpecs = await readJsonSpecs('catalog/specs');
const recipeSpecs = await readJsonSpecs('recipes');
const catalogCheck = await checkLibrarySpecs('catalog', catalogSpecs, EXPECTED_CATALOG_ATOMS);
const recipeCheck = await checkLibrarySpecs('recipes', recipeSpecs, EXPECTED_RECIPES);
const variantCheck = await checkVariants();
const defaultEquivalenceFailures = await checkDefaultEquivalence();
const semanticContrastFailures = checkSemanticContrast();
const animationCheck = await checkAnimations();

for (const check of globalChecks) {
  redCells.push({ type: check.name, theme: '*', failures: [check.failure] });
}
for (const regression of regressions) {
  if (!regression.ok) redCells.push({ type: `regression:${regression.name}`, theme: '*', failures: regression.failures });
}
const failedMatrixCells = redCells.filter((cell) => THEMES.includes(cell.theme)).length;
for (const cell of [...catalogCheck.red, ...recipeCheck.red]) {
  redCells.push({ type: `${cell.kind}:${cell.name}`, theme: cell.theme, failures: cell.failures });
}
for (const cell of variantCheck.red) {
  redCells.push({ type: `variant:${cell.type}`, theme: cell.theme, failures: cell.failures });
}
if (defaultEquivalenceFailures.length) redCells.push({ type: 'regression:default-equivalence', theme: '*', failures: defaultEquivalenceFailures });
if (semanticContrastFailures.length) redCells.push({ type: 'variant:semantic-contrast', theme: '*', failures: semanticContrastFailures });
for (const cell of animationCheck.red) {
  redCells.push({ type: `animation:${cell.name}`, theme: '*', failures: cell.failures });
}

const failedLibraryCells = [...catalogCheck.red, ...recipeCheck.red].filter((cell) => LIBRARY_THEMES.includes(cell.theme)).length;
const totalLibraryCells = (catalogCheck.actualCount + recipeCheck.actualCount) * LIBRARY_THEMES.length;
const failedVariantCells = variantCheck.red.length;
const totalVariantCells = Object.keys(variantCheck.rows).length * VARIANT_THEMES.length * 3;
const summary = {
  generatedAt: new Date().toISOString(),
  vdbVersion: createRuntime().VDB.version,
  componentCount: Object.keys(COMPONENTS).length,
  themeCount: THEMES.length,
  passedCells: Object.keys(COMPONENTS).length * THEMES.length - failedMatrixCells,
  failedCells: failedMatrixCells,
  globalFailures: globalChecks,
  regressions,
  cdnSmoke: cdn,
  library: {
    themes: LIBRARY_THEMES,
    catalog: catalogCheck,
    recipes: recipeCheck,
    passedCells: totalLibraryCells - failedLibraryCells,
    failedCells: failedLibraryCells,
  },
  variants: {
    themes: VARIANT_THEMES,
    passedCells: totalVariantCells - failedVariantCells,
    failedCells: failedVariantCells,
    defaultEquivalence: { ok: defaultEquivalenceFailures.length === 0, failures: defaultEquivalenceFailures },
    semanticContrast: { ok: semanticContrastFailures.length === 0, failures: semanticContrastFailures },
    matrix: variantCheck.rows,
  },
  animations: {
    passedCells: Object.keys(animationCheck.rows).length - animationCheck.red.length,
    failedCells: animationCheck.red.length,
    matrix: animationCheck.rows,
  },
  matrix,
  redCells,
};

await mkdir(__dirname, { recursive: true });
await writeFile(lastRunPath, JSON.stringify(summary, null, 2) + '\n', 'utf8');

const header = ['component', ...THEMES].join('\t');
const lines = [header];
for (const [type, row] of Object.entries(matrix)) {
  lines.push([type, ...THEMES.map((theme) => (row[theme].ok ? 'PASS' : 'FAIL'))].join('\t'));
}

lines.push('');
lines.push(`Version: ${summary.vdbVersion}`);
lines.push(`Cells: ${summary.passedCells} passed, ${summary.failedCells} failed`);
lines.push(`Library: ${summary.library.passedCells} passed, ${summary.library.failedCells} failed (${catalogCheck.actualCount} catalog, ${recipeCheck.actualCount} recipes across ${LIBRARY_THEMES.length} themes)`);
lines.push(`Variants: ${summary.variants.passedCells} passed, ${summary.variants.failedCells} failed; default-equivalence=${summary.variants.defaultEquivalence.ok ? 'PASS' : 'FAIL'}; semantic-contrast=${summary.variants.semanticContrast.ok ? 'PASS' : 'FAIL'}`);
lines.push(`Animations: ${summary.animations.passedCells} passed, ${summary.animations.failedCells} failed`);
lines.push(`Regressions: ${regressions.map((r) => `${r.name}=${r.ok ? 'PASS' : 'FAIL'}`).join(', ')}`);
lines.push(`CDN smoke: ${cdn.ok ? 'PASS' : 'WARN'}${cdn.status ? ` (${cdn.status})` : cdn.error ? ` (${cdn.error})` : ''}`);
lines.push(`last-run: ${lastRunPath}`);

if (redCells.length) {
  lines.push('');
  lines.push('Red cells:');
  for (const cell of redCells) {
    lines.push(`- ${cell.type} / ${cell.theme}: ${cell.failures.join('; ')}`);
  }
  process.exitCode = 1;
}

process.stdout.write(`${lines.join('\n')}\n`);
