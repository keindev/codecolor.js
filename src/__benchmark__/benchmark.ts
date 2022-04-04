/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
import Benchmark from 'benchmark';
import colors from 'colors';
import fs from 'fs';
import hljs, { LanguageFn } from 'highlight.js';
import hljsCSS from 'highlight.js/lib/languages/css';
import hljsJavaScript from 'highlight.js/lib/languages/javascript';
import hljsJSON from 'highlight.js/lib/languages/json';
import path, { dirname } from 'path';
import prism from 'prismjs';
import prismLoadLanguage from 'prismjs/components/';
import { fileURLToPath } from 'url';

import css from '../../src/languages/css';
import javascript from '../../src/languages/javascript';
import json from '../../src/languages/json';
import CodeColor from '../CodeColor';
import { ILanguageName, ISyntax } from '../types';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));
const codecolor = new CodeColor();

console.log(colors.underline('Test perf:'));

(
  [
    ['css', '../../node_modules/prismjs/themes/prism-coy.css', [hljsCSS, css]],
    ['javascript', '../../node_modules/highlight.js/lib/common.js', [hljsJavaScript, javascript]],
    ['json', '../../package.json', [hljsJSON, json]],
  ] as [ILanguageName, string, [LanguageFn, ISyntax]][]
).forEach(([language, filePath, [hljsFn, schema]]) => {
  const text = String(fs.readFileSync(path.resolve(__dirname, filePath)));
  const suite = new Benchmark.Suite();

  prismLoadLanguage([language]);
  hljs.registerLanguage(language, hljsFn);
  codecolor.register([schema]);

  console.log(`- ${colors.bold(language)}:`);
  suite.add(colors.green('codecolor.js'), () => codecolor.highlight(text, language));
  suite.add(colors.green('Prism.js'), () => prism.highlight(text, prism.languages[language]!, language));
  suite.add(colors.green('highlight.js'), () => hljs.highlight(text, { language, ignoreIllegals: true }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  suite.on('cycle', (event: any) => console.log(String(event.target)));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  suite.on('complete', (event: any) => {
    console.log(`# Fastest is ${colors.underline(event.currentTarget.filter('fastest').map('name').pop())}`);
  });

  suite.run();
});
