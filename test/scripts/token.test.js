import Token from '../../src/scripts/token';
import { LITERAL_NAME_STRING, LITERAL_NAME_FRAGMENT } from '../../src/scripts/language';

const start = 1;
const ruleIndex = 0;
const value = "A";
const offset = value.length;
const token1 = new Token(LITERAL_NAME_STRING, value, start + offset, ruleIndex);
const token2 = new Token(LITERAL_NAME_FRAGMENT, value.repeat(3), start, ruleIndex);
const token3 = new Token(LITERAL_NAME_FRAGMENT, value.repeat(4), start + offset * 4, ruleIndex);

describe('Check Token', () => {
    it('creating (STRING)', () => {
        expect(token1.value).toBe(value);
        expect(token1.start).toBe(start + offset);
        expect(token1.end).toBe(start + offset * 2);
        expect(token1.ruleIndex).toBe(ruleIndex);
        expect(token1.isFragment()).toBe(false);
    });

    it('creating (FRAGMENT)', () => {
        expect(token2.value).toBe(value.repeat(3));
        expect(token2.start).toBe(start);
        expect(token2.end).toBe(start + offset * 3);
        expect(token2.ruleIndex).toBe(ruleIndex);
        expect(token2.isFragment()).toBe(true);
    });

    it('intersections', () => {
        expect(token1.isIncludedIn(token2)).toBe(true);
        expect(token2.isIncludedIn(token1)).toBe(false);
        expect(token2.isIncludedIn(token3)).toBe(false);
        expect(token3.isIncludedIn(token2)).toBe(false);
    });
});
