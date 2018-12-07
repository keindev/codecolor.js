import Token from '../../src/scripts/token';
import { LITERAL_NAME_STRING, LITERAL_NAME_FRAGMENT } from '../../src/scripts/language';

const value = "any";
const start = 100;
const ruleIndex = 0;

describe('Check Tokens', () => {
    it('new Token: (STRING)', () => {
        const token = new Token(LITERAL_NAME_STRING, value, start, ruleIndex);

        expect(token.value).toBe(value);
        expect(token.start).toBe(start);
        expect(token.end).toBe(start + value.length);
        expect(token.ruleIndex).toBe(ruleIndex);
        expect(token.isFragment()).toBe(false);
    });

    it('new Token: (FRAGMENT)', () => {
        const token = new Token(LITERAL_NAME_FRAGMENT, value, start, ruleIndex);
        expect(token.value).toBe(value);
        expect(token.start).toBe(start);
        expect(token.end).toBe(start + value.length);
        expect(token.ruleIndex).toBe(ruleIndex);

        expect(token.isFragment()).toBe(true);
    });

    it('Intersections', () => {
        const internal = new Token(LITERAL_NAME_FRAGMENT, value[1], start + 1, ruleIndex);
        const external = new Token(LITERAL_NAME_FRAGMENT, value, start, ruleIndex);

        expect(internal.isIncludedIn(external)).toBe(true);
        expect(external.isIncludedIn(internal)).toBe(false);
    });
});
