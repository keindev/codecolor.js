/* @flow */

describe('Language', () => {
    it('creating fixme', () => {
        expect(2).toBe(2);
    });
});

// FIXME: work with real lang files
/*
import { Language } from '../../src/scripts/language';
import type {
    ISchema,
    LanguageName,
    Expression,
    MaskName
} from '../../src/scripts/language';

const TEST_LANGUAGE_NAME: string = 'test';
const TEST_EXPRESSION_NAME: MaskName = 'template';
const TEST_KEYWORD_NAME: MaskName = 'meta';
const TEST_MASK_NAME: MaskName = 'source';
const TEST_RULE_INDEX: number = 0;
const TEST_MASK_RULE: [Expression, LanguageName, MaskName] = [TEST_EXPRESSION_NAME, TEST_LANGUAGE_NAME, TEST_MASK_NAME];

const schema: ISchema = {
    name: TEST_LANGUAGE_NAME,
    expressions: {
        names: [TEST_EXPRESSION_NAME],
        values: [
            ["regExp"]
        ]
    },
    keywords: {
        names: [TEST_KEYWORD_NAME],
        values: [{
            'A': ['test']
        }]
    },
    masks: {},
};
const language: Language = new Language(TEST_LANGUAGE_NAME, schema);

describe('Language', () => {
    it('creating', () => {
        expect(language.expressions.length).toBe(schema.expressions.values.length);
        expect(language.activeExpressions).toEqual(schema.expressions.names.length);

        expect(language.keywords.length).toBe(schema.keywords.values.length);
        expect(language.activeKeywords).toEqual(schema.keywords.names.length);

        expect(language.masks).toEqual(schema.masks);
    });

    /*it('each literals', (done) => {
        let i = 0;

        language.eachExp((name, expression, ruleIndex) => {
            expect(name).toBe(LITERAL_NAMES[i++]);
            expect(expression).toBe(ANY_LITERAL_REGEXP);
            expect(ruleIndex).toBe(ANY_RULE_INDEX);

            if (i === LITERAL_NAMES.length) done();
        });
    });

    it('find keyword by name', () => {
        KEYWORD_NAMES.forEach((name: MaskName, i: number) => {
            ANY_KEYWORD_CHARS.forEach((char) => {
                expect(language.getKeywordName(char.repeat(i + 1))).toBe(name);
            });
        });
    });

    it('check masked literals', () => {
        LITERAL_NAMES.forEach((name: LiteralName) => {
            expect(language.isMasked(name, ANY_RULE_INDEX)).toBe(true);
            expect(language.getMask(name, ANY_RULE_INDEX)).toEqual(ANY_MASK_RULE);
        });
    });
});
*/
