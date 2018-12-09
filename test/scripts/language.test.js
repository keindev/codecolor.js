import Language from '../../src/scripts/language';
import { LITERAL_NAMES, STATEMENT_NAMES } from '../../src/scripts/language';

const ANY_LANGUAGE_NAME = 'any';
const ANY_LITERAL_REGEXP = 'any';
const ANY_STATEMENT_CHARS = ['A', 'B', 'C'];
const ANY_RULE_INDEX = 0;
const ANY_MASK_RULE = [ANY_LITERAL_REGEXP, ANY_LANGUAGE_NAME];

let schema = {
    name: ANY_LANGUAGE_NAME,
    literals: {},
    statements: {},
    masks: {}
};

LITERAL_NAMES.forEach(name => {
    schema.literals[name] = [ANY_LITERAL_REGEXP];
    schema.masks[name] = [ANY_MASK_RULE];
});

STATEMENT_NAMES.forEach((name, i) => {
    schema.statements[name] = {};

    ANY_STATEMENT_CHARS.forEach(char => {
        schema.statements[name][char] = [char.repeat(i + 1)];
    });
});

const language = new Language(schema);

describe('Check Language', () => {
    it('creating', () => {
        expect(language.name).toBeUndefined();
        expect(language.literals.length).toBe(LITERAL_NAMES.length);
        expect(language.statements.length).toBe(STATEMENT_NAMES.length);
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
        STATEMENT_NAMES.forEach((name, i) => {
            ANY_STATEMENT_CHARS.forEach(char => {
                expect(language.getStatementName(char.repeat(i + 1))).toBe(name);
            });
        });
    });

    it('check masked literals', () => {
        LITERAL_NAMES.forEach(name => {
            expect(language.isMasked(name, ANY_RULE_INDEX)).toBe(true);
            expect(language.getMask(name, ANY_RULE_INDEX)).toEqual(ANY_MASK_RULE);
        });
    });
});
