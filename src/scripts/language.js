/* @flow */

export type ABC = 'A' | 'a' | 'B' | 'b' | 'C' | 'c' | 'D' | 'd' | 'E' | 'e' | 'F' | 'f' | 'G' | 'g' |
    'H' | 'h' | 'I' | 'i' | 'J' | 'j' | 'K' | 'k' | 'L' | 'l' | 'M' | 'm' | 'N' | 'n' | 'O' | 'o' | 'P' | 'p' |
    'Q' | 'q' | 'R' | 'r' | 'S' | 's' | 'T' | 't' | 'U' | 'u' | 'V' | 'v' | 'W' | 'w' | 'X' | 'x' | 'Y' | 'y' |
    'Z' | 'z';
export type MaskName = 'comment' | 'template' | 'string' | 'constant' | 'storage' | 'attribute' | 'operator' |
    'variable' | 'interpolation' | 'keyword' | 'symbol' | 'entity' | 'meta' | 'source' | 'emphasis' | 'strong' |
    'link';
export type LanguageName = string;
export type Expression = string;
export type ExpressionRule = Expression[];
export type KeywordRule = { [key: ABC]: string[] };
export type MaskRule = [Expression, LanguageName, MaskName | void] | MaskName;

export type Rule<T> = {
    names: MaskName[],
    values: T[],
};

export interface ISchema {
    name: LanguageName;
    expressions: Rule<ExpressionRule>;
    keywords: Rule<KeywordRule>;
    masks?: { [key: MaskName]: MaskRule[] };
}

export const PREFIX = 'cc-';
export const MASK_NAME_SOURCE: MaskName = 'source';

export class Language {
    name: LanguageName;
    expressions: ExpressionRule[]
    keywords: KeywordRule[];
    masks: $PropertyType<ISchema, 'masks'>;
    activeKeywords: MaskName[];
    activeExpressions: MaskName[];

    constructor(name: LanguageName, schema: $ReadOnly<ISchema>) {
        this.name = name;
        this.expressions = schema.expressions.values;
        this.activeExpressions = schema.expressions.names;
        this.keywords = typeof schema.keywords === 'object' ? schema.keywords.values : [];
        this.activeKeywords = typeof schema.keywords === 'object' ? schema.keywords.names : [];
        this.masks = schema.masks;
    }

    eachExp(callback: (name: MaskName, expression: string, ruleIndex: number) => void) {
        this.expressions.forEach((rule: ExpressionRule, expressionIndex: number) => {
            rule.forEach((expression: string, ruleIndex: number) => {
                callback(this.activeExpressions[expressionIndex], expression, ruleIndex);
            });
        });
    }

    getKeywordName(value: string): MaskName | void {
        const char: any = value[0];
        let rule: KeywordRule;
        let i: number = 0;

        while ((rule = this.keywords[i]) && !(rule[char] && ~rule[char].indexOf(value))) i++;

        return this.activeKeywords[i];
    }

    getMask(name: MaskName, index: number): MaskRule | void {
        let mask: MaskRule | void;

        if (typeof this.masks !== 'undefined' && Array.isArray(this.masks[name]) && !!this.masks[name][index]) {
            mask = this.masks[name][index];
        }

        return mask;
    }
}
