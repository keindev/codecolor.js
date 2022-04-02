import Token from '../../scripts/Token';
import { IPattern } from '../../scripts/types';

describe('Token', () => {
  const start = 1;
  const value = 'A';
  const offset: number = value.length;
  const tokenMask1: IPattern = 'string';
  const tokenMask2: IPattern = 'source';

  const token1 = new Token(tokenMask1, value, start + offset);
  const token2 = new Token(tokenMask2, value.repeat(3), start);
  const token3 = new Token(tokenMask2, value.repeat(4), start + offset * 4);

  it('creating (String)', () => {
    expect(token1.value).toBe(value);
    expect(token1.start).toBe(start + offset);
    expect(token1.end).toBe(start + offset * 2);
    expect(token1.isSource()).toBe(false);
  });

  it('creating (Source)', () => {
    expect(token2.value).toBe(value.repeat(3));
    expect(token2.start).toBe(start);
    expect(token2.end).toBe(start + offset * 3);
    expect(token2.isSource()).toBe(true);
  });

  it('intersections', () => {
    expect(token1.isIncludedIn(token2)).toBe(true);
    expect(token2.isIncludedIn(token1)).toBe(false);
    expect(token2.isIncludedIn(token3)).toBe(false);
    expect(token3.isIncludedIn(token2)).toBe(false);
  });
});
