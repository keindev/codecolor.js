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
import Library, { ISchema } from '../index';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(colors.underline('Test perf:'));
(
  [
    [css, '../../node_modules/prismjs/themes/prism-coy.css', hljsCSS],
    [javascript, '../../node_modules/highlight.js/lib/common.js', hljsJavaScript],
    [json, '../../package.json', hljsJSON],
  ] as [ISchema, string, LanguageFn][]
).forEach(([schema, filePath, hljsFn]) => {
  const text = String(fs.readFileSync(path.resolve(__dirname, filePath)));
  const suite = new Benchmark.Suite();
  const codecolor = new Library();

  prismLoadLanguage([schema.name]);
  hljs.registerLanguage(schema.name, hljsFn);
  codecolor.addSchema(schema);

  console.log(`- ${colors.bold(schema.name)}:`);
  suite.add(colors.green('CodeColor.js'), () => codecolor.highlight(text, schema.name));
  suite.add(colors.green('Prism.js'), () => prism.highlight(text, prism.languages[schema.name]!, schema.name));
  suite.add(colors.green('highlight.js'), () => hljs.highlight(text, { language: schema.name, ignoreIllegals: true }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  suite.on('cycle', (event: any) => console.log(String(event.target)));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  suite.on('complete', (event: any) => {
    console.log(`# Fastest is ${colors.underline(event.currentTarget.filter('fastest').map('name').pop())}`);
  });

  suite.run();
});
