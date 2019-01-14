/* @flow */

import { Language } from '../../src/scripts/language';
import type {
    ISchema,
    Expression,
    MaskName,
} from '../../src/scripts/language';

const TEST_LANGUAGE_NAME: string = 'test';
const TEST_EXPRESSION_NAME: MaskName = 'template';
const TEST_EXPRESSION_VALUE: Expression = 'regExp';
const TEST_KEYWORD_NAME: MaskName = 'meta';
const TEST_KEYWORD_VALUE: string = 'test';
const TEST_RULE_INDEX: number = 0;

const schema: ISchema = {
    name: TEST_LANGUAGE_NAME,
    expressions: {
        names: [TEST_EXPRESSION_NAME],
        values: [
            [TEST_EXPRESSION_VALUE],
        ],
    },
    keywords: {
        names: [TEST_KEYWORD_NAME],
        values: [{
            t: [TEST_KEYWORD_VALUE],
        }],
    },
};
const language: Language = new Language(TEST_LANGUAGE_NAME, schema);

describe('Language', () => {
    it('creating', () => {
        expect(language.expressions.length).toBe(schema.expressions.values.length);
        expect(language.activeExpressions.length).toEqual(schema.expressions.names.length);

        expect(language.keywords.length).toBe(schema.keywords.values.length);
        expect(language.activeKeywords.length).toEqual(schema.keywords.names.length);

        expect(language.masks).toBeUndefined();
    });

    it('each expressions', (done) => {
        language.eachExp((name, expression, ruleIndex) => {
            expect(name).toBe(TEST_EXPRESSION_NAME);
            expect(expression).toBe(TEST_EXPRESSION_VALUE);
            expect(ruleIndex).toBe(TEST_RULE_INDEX);
        });

        done();
    });

    it('find keyword by name', () => {
        expect(language.getKeywordName(TEST_KEYWORD_VALUE)).toBe(TEST_KEYWORD_NAME);
    });
});
