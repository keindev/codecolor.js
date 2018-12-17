/* @flow */

import { Language, literals, statements } from '../../src/scripts/language';
import type {
    ISchema,
    LiteralName,
    StatementName,
    StatementRuleName,
} from '../../src/scripts/language';

const ANY_LANGUAGE_NAME: string = 'any';
const ANY_LITERAL_REGEXP: string = 'any';
const ANY_STATEMENT_CHARS: StatementRuleName[] = ['A', 'B', 'C'];
const ANY_RULE_INDEX: number = 0;
const ANY_MASK_RULE: [string, string] = [ANY_LITERAL_REGEXP, ANY_LANGUAGE_NAME];
const LITERAL_NAMES = Object.keys(literals);
const STATEMENT_NAMES = Object.keys(statements);
const schema: ISchema = {
    name: ANY_LANGUAGE_NAME,
    literals: {},
    statements: {},
    masks: {},
};

LITERAL_NAMES.forEach((name: LiteralName) => {
    schema.literals[name] = [ANY_LITERAL_REGEXP];
    schema.masks[name] = [ANY_MASK_RULE];
});

STATEMENT_NAMES.forEach((name, i) => {
    schema.statements[name] = {};

    ANY_STATEMENT_CHARS.forEach((char: StatementRuleName) => {
        schema.statements[name][char] = [char.repeat(i + 1)];
    });
});

const language: Language = new Language(ANY_LANGUAGE_NAME, schema);

describe('Language', () => {
    it('creating', () => {
        expect(language.literalRules.length).toBe(LITERAL_NAMES.length);
        expect(language.literalNames).toEqual(LITERAL_NAMES);

        expect(language.statementRules.length).toBe(STATEMENT_NAMES.length);
        expect(language.statementNames).toEqual(STATEMENT_NAMES);

        expect(language.masks).toEqual(schema.masks);
    });

    it('each literals', (done) => {
        let i = 0;

        language.eachLiterals((name, expression, ruleIndex) => {
            expect(name).toBe(LITERAL_NAMES[i++]);
            expect(expression).toBe(ANY_LITERAL_REGEXP);
            expect(ruleIndex).toBe(ANY_RULE_INDEX);

            if (i === LITERAL_NAMES.length) done();
        });
    });

    it('find statement by name', () => {
        STATEMENT_NAMES.forEach((name: StatementName, i: number) => {
            ANY_STATEMENT_CHARS.forEach((char) => {
                expect(language.getStatementName(char.repeat(i + 1))).toBe(name);
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
