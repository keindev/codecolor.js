// @flow

import type { LiteralName } from './language';
import { LITERAL_NAME_FRAGMENT } from './language';

export default class Token {
    name: LiteralName;
    value: string;
    start: number;
    end: number;
    ruleIndex: number;

    constructor(name: LiteralName, value: string, position: number, ruleIndex: number) {
        this.name = name;
        this.value = value;
        this.start = position;
        this.end = position + value.length;
        this.ruleIndex = ruleIndex;
    }

    isIncludeIn(token: Token): boolean {
        return this.start >= token.start && this.end <= token.end;
    }

    isFragment(): boolean {
        return this.name === LITERAL_NAME_FRAGMENT;
    }
}
