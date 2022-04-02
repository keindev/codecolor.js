import { MASK_NAME_SOURCE } from './Language';
import { IMask, IPattern } from './types';

export default class Token {
  end: number;
  mask?: IMask;
  pattern: IPattern;
  start: number;
  value: string;

  constructor(pattern: IPattern, value: string, position: number, mask?: IMask) {
    this.pattern = pattern;
    this.value = value;
    this.start = position;
    this.end = position + value.length;
    this.mask = mask;
  }

  isCross(token: Token): boolean {
    return this.start >= token.start && this.start <= token.end && this.end >= token.end;
  }

  isIncludedIn(token: Token): boolean {
    return this.start >= token.start && this.end <= token.end;
  }

  isSource(): boolean {
    return this.pattern === MASK_NAME_SOURCE;
  }
}
