import { IToken } from './types';

const isCross = (a: IToken, b: IToken): boolean => a.start >= b.start && a.start <= b.end && a.end >= b.end;
const isIncludedIn = (a: IToken, b: IToken): boolean => a.start >= b.start && a.end <= b.end;

export const half = (value: number): number => ~~(value / 2);
export const compare = (left: number, right: number, token: IToken, tokens: IToken[]): number => {
  if (right <= tokens.length && left < right) {
    const middle = tokens[right - 1];

    if (middle) {
      if (middle.end <= token.start) return compare(right, right + half(tokens.length - right + 1), token, tokens);
      if (middle.start >= token.end) return compare(left, left + half(right - left), token, tokens);
      if (isIncludedIn(token, middle)) return -Infinity;
      if (isIncludedIn(middle, token)) return right === 1 ? Infinity : -(right - 1);
      if (isCross(middle, token)) return Infinity;
    }
  }

  return right;
};
