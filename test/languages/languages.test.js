// @flow

// TODO: test typing

import path from 'path';
import fs from 'fs';
import library from '../../src/scripts/library';

const LANGUAGES_DIR = './src/languages';
const MARKUP_DIR = './test/languages/markup';
const MARKUP_EXTENSION = '.html';
const SCHEMA_EXTENSION = '.json';
const ENCODING = 'utf8';

function getMarkups(languageName) {
    const dirPath = path.join(MARKUP_DIR, languageName);
    const files = fs.readdirSync(dirPath);
    const markups = {};
    let basename;
    let extension;
    let text;

    files.forEach((file) => {
        extension = path.extname(file);
        basename = path.basename(file, extension);
        text = fs.readFileSync(path.join(dirPath, file), ENCODING);
        markups[basename] = markups[basename] || {};

        if (extension === MARKUP_EXTENSION) {
            // FIXME: remove trim
            markups[basename].html = text.trim();
        } else {
            // FIXME: remove trim
            markups[basename].code = text.trim();
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

    describe('languages', () => {
        try {
            const schemaFiles = fs.readdirSync(LANGUAGES_DIR);
            const getLanguagesCount = () => Object.keys(library.languages).length;

            schemaFiles.forEach((schemaFile) => {
                const languageName = path.basename(schemaFile, SCHEMA_EXTENSION);
                const schema = JSON.parse(fs.readFileSync(path.join(LANGUAGES_DIR, schemaFile), ENCODING));
                const count = getLanguagesCount();

                describe(`${languageName}`, () => {
                    it('schema', () => {
                        expect(schema.name).toBe(languageName);

                        library.addSchema(schema);

                        expect(library.activeSchema).toBe(languageName);
                        expect(getLanguagesCount()).toBe(count + 1);
                    });

                    const markups = getMarkups(languageName);

                    Object.keys(markups).forEach((markupName) => {
                        it(markupName, () => {
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
