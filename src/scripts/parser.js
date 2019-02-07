/* @flow */

import Token from './token';
import type {
    Language, LanguageName,
    MaskName, MaskRule,
} from './language';
import { MASK_NAME_SOURCE } from './language';

export type Languages = { [key: LanguageName]: Language };

export default class Parser {
    code: string;
    languages: Languages;
    language: Language;
    tokens: Token[];

    static parse(code: string, name: LanguageName, languages: Languages) {
        const parser = new Parser(code, name, languages);

        parser.analize();

        return parser.render();
    }

    constructor(code: string, name: LanguageName, languages: Languages) {
        this.code = code;
        this.languages = languages;
        this.language = languages[name];
        this.tokens = [];
    }

    analize(): void {
        let match: RegExp$matchResult | null;
        let regExp: RegExp;
        let newToken: Token;
        let existingToken: Token;
        let tokenIndex: number = NaN;
        const { tokens } = this;
        const half = (value: number): number => ~~(value / 2);
        const compare = (left: number, right: number): number => {
            if (right <= tokens.length && left < right) {
                existingToken = tokens[right - 1];

                if (existingToken.end <= newToken.start) return compare(right, right + half(tokens.length - right + 1));
                if (existingToken.start >= newToken.end) return compare(left, left + half(right - left));
                if (newToken.isIncludedIn(existingToken)) return -Infinity;
                if (existingToken.isIncludedIn(newToken)) return right === 1 ? Infinity : -(right - 1);
                if (existingToken.isCross(newToken)) return Infinity;
            }

            return right;
        };

        this.language.eachExp((name: MaskName, expression: string, ruleIndex: number) => {
            regExp = new RegExp(expression, 'gm');

            while ((match = regExp.exec(this.code))) {
                newToken = new Token(name, match[0], match.index, ruleIndex);

                if ((tokenIndex = compare(0, Math.max(half(tokens.length), 1))) >= 0) {
                    if (Number.isFinite(tokenIndex)) {
                        tokens.splice(tokenIndex, 0, newToken);
                    } else {
                        tokens[0] = newToken;
                    }
                } else if (Number.isFinite(tokenIndex)) {
                    tokens[Math.abs(tokenIndex)] = newToken;
                }
            }
        });
    }

    wrap(token: Token): string {
        const getTag = (className: string, text: string): string => `<span class="cc-${className}">${text}</span>`;
        const name: MaskName | void = token.isSource()
            ? this.language.getKeywordName(token.value)
            : token.name;
        let result: string;

        if (typeof name === 'undefined') {
            result = token.value;
        } else {
            const mask: MaskRule | void = this.language.getMask(name, token.ruleIndex);

            if (typeof mask === 'undefined') {
                result = getTag(name, token.value);
            } else {
                const regExp: RegExp = new RegExp(mask[0], 'gm');
                const parts: string[] = [];
                let position: number = 0;
                let match: RegExp$matchResult | null;

                while ((match = regExp.exec(token.value))) {
                    parts.push(token.value.substring(position, match.index),
                        getTag(mask[2] || MASK_NAME_SOURCE, Parser.parse(match[0], mask[1], this.languages)));
                    position = regExp.lastIndex;
                }

                parts.push(token.value.substring(position, token.value.length));

                result = getTag(name, parts.join(''));
            }
        }

        return result;
    }

    render(): string {
        let position: number = 0;
        const stack: string[] = [];

        this.tokens.forEach((token: Token) => {
            if (position < token.start) {
                stack.push(this.code.substring(position, token.start));
            }

            stack.push(this.wrap(token));
            position = token.end;
        });

        stack.push(this.code.substring(position));

        return stack.join('');
    }
}
