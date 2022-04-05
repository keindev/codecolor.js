<p align="center"><img src="https://cdn.jsdelivr.net/gh/keindev/codecolor.js/media/banner.svg" alt="Package logo"></p>

<p align="center">
    <a href="https://travis-ci.com/keindev/codecolor.js"><img src="https://travis-ci.com/keindev/codecolor.js.svg?branch=master" alt="Build Status"></a>
    <a href="https://codecov.io/gh/keindev/codecolor.js"><img src="https://codecov.io/gh/keindev/codecolor.js/branch/master/graph/badge.svg" /></a>
    <a href="https://www.npmjs.com/package/codecolor.js"><img alt="npm" src="https://img.shields.io/npm/v/codecolor.js.svg"></a>
    <a href="https://github.com/tagproject/ts-package-shared-config"><img src="https://img.shields.io/badge/standard--shared--config-nodejs%2Bts-green?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAfCAYAAACh+E5kAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJQSURBVHgB1VftUcMwDFU4/tMNyAZ0A7IBbBA2CExAmIBjApcJChO0TFA2SJkgMIGRyDNV3TSt26RN353OX/LHUyTZIdoB1tqMZcaS0imBDzxkeWaJWR51SX0HrJ6pdsJyifpdb4loq3v9A+1CaBuWMR0Q502DzuJRFD34Y9z3DXIRNy/QPWKZY27COlM6BtZZHWMJ3CkVa28KZMTJkDpCVLOhs/oL2gMuEhYpxeenPPah9EdczLkvpwZgnQHWnlNLiNQGYiWx5gu6Ehz4m+WNN/2i9Yd75CJmeRDXogbIFxECrqQ2wIvlLBOXaViuYbGQNSQLFSGZyOnulb2wadaGnyoSSeC8GBJkNDf5kloESAhy2gFIIPG2+ufUMtivn/gAEi+Gy4u6FLxh/qer8/xbLq7QlNh6X4mbtr+A3pylDI0Lb43YrmLmXP5v3a4I4ABDRSI4xjB/ghveoj4BCVm37JQADhGDgOA+YJ48TSaoOwKpt27aOQG1WRES3La65WPU3dysTjE8de0Aj8SsKS5sdS9lqCeYI08bU6d8EALYS5OoDW4c3qi2gf7f+4yODfj2DIcqdVzYKnMtEUO7RP2gT/W1AImxXSC3i7R7rfRuMT5G2xzSYzaCDzOyyzDeuNHZx1a3fOdJJwh28fRwwT1QY6Xzf7TvWG6ob/BIGPQ59ymUngRyRn2El6Fy5T7G0zl+JmoC3KRQXyT1xpfiJKIeAemzqBl6U3V5ocZNf4hHg61u223wn4nOqF8IzvF9IxCMkyfQ+i/lnnhlmW6h9+Mqv1SmQhehji4JAAAAAElFTkSuQmCC" alt="Standard Shared Config"></a>
</p>

Fast, small and simple syntax highlighter library.

## Install

```
npm install codecolor.js
```

## Cautions:

- Regular expressions of language files use "Lookbehind Assertions" (see [proposal-regexp-lookbehind](https://github.com/tc39/proposal-regexp-lookbehind)).
- Due to the lack of a PCRE recursive parameter <code>(?R)</code>, nested structures (for example ["Template literals"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)) have a maximum nesting equal to two.

## Usage

```typescript
import CodeColor from 'codecolor.js';
import css from 'codecolor.js/languages/css';
import javascript from 'codecolor.js/javascript';
import json from 'codecolor.js/languages/json';

const codecolor = new CodeColor();

codecolor.register([css, javascript, json]);

// source code
const code = '...';
const html = codecolor.highlight(code, javascript.name);

// highlighted code
console.log(html);

/*
<pre>
  <code class="cc-container">
    ...
  </code>
</pre>
*/
```

## Benchmark

```console
npm run benchmark

---

Test perf:
- css:
codecolor.js x 3,193 ops/sec ±0.28% (95 runs sampled)
Prism.js x 2,931 ops/sec ±0.36% (96 runs sampled)
highlight.js x 849 ops/sec ±0.80% (95 runs sampled)
# Fastest is codecolor.js

- javascript:
codecolor.js x 4,782 ops/sec ±0.48% (96 runs sampled)
Prism.js x 3,031 ops/sec ±0.36% (96 runs sampled)
highlight.js x 1,275 ops/sec ±0.40% (96 runs sampled)
# Fastest is codecolor.js

- json:
codecolor.js x 6,743 ops/sec ±1.02% (95 runs sampled)
Prism.js x 4,243 ops/sec ±0.36% (95 runs sampled)
highlight.js x 1,468 ops/sec ±0.81% (96 runs sampled)
# Fastest is codecolor.js

---

OS: Ubuntu 21.10 x86_64
DE: GNOME 40.5
Terminal: tilix
CPU: Intel i9-9900 (16) @ 5.000GHz
GPU: NVIDIA GeForce RTX 2070
Memory: 32019MiB

```

## API

Read the [API documentation](docs/api/index.md) for more information.
