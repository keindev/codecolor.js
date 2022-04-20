import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import CodeColor from '../CodeColor.js';
import bash from '../languages/bash.js';
import css from '../languages/css.js';
import javascript from '../languages/javascript.js';
import json from '../languages/json.js';
import scss from '../languages/scss.js';
import yaml from '../languages/yaml.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MARKUP_DIR = './markup';
const EXPECT_MARKUP_EXTENSION = '.expect';
const ENCODING = 'utf8';

type Markup = { code: string; html: string };
type Markups = { [key: string]: Markup };

function getMarkups(languageName: string): Markups {
  const dirPath = path.join(__dirname, MARKUP_DIR, languageName);
  const files: string[] = fs.readdirSync(dirPath);
  const markups: Markups = {};
  let basename: string;
  let extension: string;
  let text: string;

  files.forEach((file: string) => {
    extension = path.extname(file);
    basename = path.basename(file, extension);
    text = String(fs.readFileSync(path.join(dirPath, file), ENCODING)).replace(/\n$/, '');
    // TODO: remove ({} as Markup)
    markups[basename] = markups[basename] || ({} as Markup);

    if (extension === EXPECT_MARKUP_EXTENSION) {
      // TODO: remove !
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      markups[basename]!.html = text;
    } else {
      // TODO: remove !
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      markups[basename]!.code = text;
    }
  });

  return markups;
}

describe('Check Library', () => {
  const library = new CodeColor();

  describe('Languages:', () => {
    [bash, css, javascript, json, yaml, scss].forEach((schema, index) => {
      describe(`- ${schema.name}: `, () => {
        it('# Schema', () => {
          expect(schema.name).toBe(schema.name);

          library.register([schema]);

          expect(library.languages.size).toBe(index + 1);
        });

        const markups: Markups = getMarkups(schema.name);

        Object.keys(markups).forEach(markupName => {
          it(`- ${markupName}`, () => {
            // TODO: remove !
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { code, html } = markups[markupName]!;

            expect(code.length).toBeGreaterThan(0);
            expect(html.length).toBeGreaterThan(0);
            expect(library.highlight(code, schema.name)).toBe(html);
          });
        });
      });
    });
  });
});
