# vdb — Visual DashBoard engine

A tiny, dependency-free engine that renders themed dashboards from a compact spec.
Hosted here so it can be loaded from jsDelivr and driven with one-line specs.

## Use

```html
<div id="v"></div>
<script src="https://cdn.jsdelivr.net/gh/RussellBrb/vdb@v1/vdb.js"></script>
<script>
VDB('#v', {
  theme: 'under-the-sea',            // named theme, or { vibe: 'any phrase' }
  title: 'Token Economy', tag: 'live',
  components: [
    { type: 'gauge', value: 0.78, display: 'B+', label: 'economy' },
    { type: 'bars', items: [ {label:'Signal', value:88}, {label:'Thrift', value:58, note:'58'} ] },
    { type: 'allocation', title: 'effort', items: [ {label:'features', value:38}, {label:'fixes', value:27} ] },
    { type: 'sparkline', title: 'throughput', points: [4,6,5,9,7,11], caption: 'commits/day' },
    { type: 'tiles', items: [ {value:'7', label:'services'} ] },
    { type: 'pipeline', items: [ {label:'build', state:'done'}, {label:'ship', state:'active'} ] },
    { type: 'note', text: '…' }
  ]
});
</script>
```

## Themes
Named: `twilight-forest`, `under-the-sea`, `sunrise`, `synthwave`, `crt`, `chill`, `blueprint`.
Or generate one from a phrase: `theme: { vibe: 'tropical waters vacation' }` — deterministic
(string hash → Mulberry32 → HSL), so the same phrase always yields the same palette.

## Components
`gauge` · `bars` · `allocation` · `sparkline` · `tiles` · `pipeline` · `note`

## Versioning
Pin a tag for cache stability: `@v1`, `@v2`, … (`@main` serves the latest commit).
Bump the tag whenever `vdb.js` changes — jsDelivr caches tagged versions.
