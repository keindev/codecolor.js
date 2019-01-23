/* @flow */
import { MASK_NAME_SOURCE } from './language';
import type { MaskName } from './language';

export default class Token {
    name: MaskName;
    value: string;
    start: number;
    end: number;
    ruleIndex: number;

    constructor(name: MaskName, value: string, position: number, ruleIndex: number) {
        this.name = name;
        this.value = value;
        this.start = position;
        this.end = position + value.length;
        this.ruleIndex = ruleIndex;
    }

    isIncludedIn(token: Token): boolean {
        return this.start >= token.start && this.end <= token.end;
    }

    isSource(): boolean {
        return this.name === MASK_NAME_SOURCE;
    }
}
