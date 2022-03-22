import { MASK_NAME_SOURCE, MaskName } from './Language';

export default class Token {
  end: number;
  name: MaskName;
  ruleIndex: number;
  start: number;
  value: string;

  constructor(name: MaskName, value: string, position: number, ruleIndex: number) {
    this.name = name;
    this.value = value;
    this.start = position;
    this.end = position + value.length;
    this.ruleIndex = ruleIndex;
  }

  isCross(token: Token): boolean {
    return this.start >= token.start && this.start <= token.end && this.end >= token.end;
  }

  isIncludedIn(token: Token): boolean {
    return this.start >= token.start && this.end <= token.end;
  }

  isSource(): boolean {
    return this.name === MASK_NAME_SOURCE;
  }
}
