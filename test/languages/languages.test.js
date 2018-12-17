/* @flow */

import path from 'path';
import fs from 'fs';
import library from '../../src/scripts/library';

const LANGUAGES_DIR: string = './src/languages';
const MARKUP_DIR: string = './test/languages/markup';
const MARKUP_EXTENSION: string = '.html';
const SCHEMA_EXTENSION: string = '.json';
const ENCODING: string = 'utf8';

type Markup = { html: string, code: string };
type Markups = { [key: string]: Markup };

function getMarkups(languageName: string): Markups {
    const dirPath: string = path.join(MARKUP_DIR, languageName);
    const files: string[] = fs.readdirSync(dirPath);
    const markups: Markups = {};
    let basename: string;
    let extension: string;
    let text: string;

    files.forEach((file: string) => {
        extension = path.extname(file);
        basename = path.basename(file, extension);
        text = String(fs.readFileSync(path.join(dirPath, file), ENCODING)).replace(/\n$/, '');
        markups[basename] = markups[basename] || {};

        if (extension === MARKUP_EXTENSION) {
            markups[basename].html = text;
        } else {
            markups[basename].code = text;
        }
    });

    return markups;
}

describe('Check Library', () => {
    it('initialization', () => {
        expect(library.version).toBeDefined();
        expect(library.languages).toEqual({});
        expect(library.activeSchema).toBeUndefined();
    });

    describe('Languages: ', () => {
        try {
            const schemaFiles: string[] = fs.readdirSync(LANGUAGES_DIR);
            const getLanguagesCount = (): number => Object.keys(library.languages).length;

            schemaFiles.forEach((schemaFile: string) => {
                const languageName: string = path.basename(schemaFile, SCHEMA_EXTENSION);
                const schema: any = JSON.parse(fs.readFileSync(path.join(LANGUAGES_DIR, schemaFile), ENCODING));
                const count: number = getLanguagesCount();

                describe(`- ${languageName}: `, () => {
                    it('# Schema', () => {
                        expect(schema.name).toBe(languageName);

                        library.addSchema(schema);

                        expect(library.activeSchema).toBe(languageName);
                        expect(getLanguagesCount()).toBe(count + 1);
                    });

                    const markups: Markups = getMarkups(languageName);

                    Object.keys(markups).forEach((markupName) => {
                        it(`- ${markupName}`, () => {
                            const { code, html } = markups[markupName];

                            expect(code.length).toBeGreaterThan(0);
                            expect(html.length).toBeGreaterThan(0);
                            expect(library.highlight(code)).toBe(html);
                        });
                    });
                });
            });
        } catch (err) {
            throw err;
        }
    });
});
