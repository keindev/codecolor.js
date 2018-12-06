// @flow

export type StatementRuleName = 'A' | 'a' | 'B' | 'b' | 'C' | 'c' | 'D' | 'd' | 'E' | 'e' | 'F' | 'f' | 'G' | 'g' |
        'H' | 'h' | 'I' | 'i' | 'J' | 'j' | 'K' | 'k' | 'L' | 'l' | 'M' | 'm' | 'N' | 'n' | 'O' | 'o' | 'P' | 'p' |
        'Q' | 'q' | 'R' | 'r' | 'S' | 's' | 'T' | 't' | 'U' | 'u' | 'V' | 'v' | 'W' | 'w' | 'X' | 'x' | 'Y' | 'y' |
        'Z' | 'z';

export type LanguageName = string;
export type LiteralRule = string[];
export type StatementRule = { [StatementRuleName]: LiteralRule };
export type MaskRule = [string, LanguageName];

export interface ILanguageLiterals {
    comment: LiteralRule[];
    template: LiteralRule[];
    string: LiteralRule[];
    fragment: LiteralRule[];
    number: LiteralRule[];
    operator: LiteralRule[];
}

export interface ILanguageStatements {
    keyword: StatementRule;
    primitive: StatementRule;
    builtin: StatementRule;
}

export type LiteralName = $Keys<ILanguageLiterals>;
export type StatementName = $Keys<ILanguageStatements>;
export type LanguageMasks = { [key: LiteralName | StatementName ]: MaskRule[] };

export interface ILanguageSchema {
    name: LanguageName;
    literals: ILanguageLiterals;
    statements: ILanguageStatements;
    masks: LanguageMasks;
}

export interface ILanguage {
    literals: LiteralRule[];
    statements: StatementRule[];
    masks: LanguageMasks;
}

export const LITERAL_NAME_COMMENT: LiteralName = 'comment';
export const LITERAL_NAME_TEMPLATE: LiteralName = 'template';
export const LITERAL_NAME_STRING: LiteralName = 'string';
export const LITERAL_NAME_FRAGMENT: LiteralName = 'fragment';
export const LITERAL_NAME_NUMBER: LiteralName = 'number';
export const LITERAL_NAME_OPERATOR: LiteralName = 'operator';

export const STATEMENT_NAME_KEYWORD: StatementName = 'keyword';
export const STATEMENT_NAME_PRIMITIVE: StatementName = 'primitive';
export const STATEMENT_NAME_BUILTIN: StatementName = 'builtin';

const LITERAL_NAMES: LiteralName[] = [
    LITERAL_NAME_COMMENT,
    LITERAL_NAME_TEMPLATE,
    LITERAL_NAME_STRING,
    LITERAL_NAME_NUMBER,
    LITERAL_NAME_FRAGMENT,
    LITERAL_NAME_OPERATOR,
];

const STATEMENT_NAMES: StatementName[] = [
    STATEMENT_NAME_KEYWORD,
    STATEMENT_NAME_PRIMITIVE,
    STATEMENT_NAME_BUILTIN,
];

export default class Language implements ILanguage {
    literals: LiteralRule[];
    statements: StatementRule[];
    masks: LanguageMasks;

    constructor(schema: $ReadOnly<ILanguageSchema>) {
        const getRules = function<TName, TRule> (names: TName[], rules: {[key: TName]: TRule}): TRule[] {
            return names.reduce((accumulator: TRule[], name: TName) => {
                if (typeof rules[name] !== 'undefined') {
                    accumulator.push(rules[name]);
                }

                return accumulator;
            }, []);
        };

        this.literals = getRules(LITERAL_NAMES, schema.literals);
        this.statements = getRules(STATEMENT_NAMES, schema.statements);
        this.masks = (typeof schema.masks === 'object') ? schema.masks : {};
    }

    eachLiterals(callback: (name: LiteralName, expression: string, ruleIndex: number) => void) {
        this.literals.forEach((rule: LiteralRule, literalIndex: number) => {
            rule.forEach((expression: string, ruleIndex: number) => {
                callback(LITERAL_NAMES[literalIndex], expression, ruleIndex);
            });
        });
    }

    getStatementName(value: string): StatementName | void {
        const char: any = value[0];
        let statement: StatementRule;
        let i: number = 0;

        while ((statement = this.statements[i]) && !(statement[char] && ~statement[char].indexOf(value))) i++;

        return STATEMENT_NAMES[i];
    }

    getMask(name: LiteralName | StatementName, index: number): MaskRule {
        return this.masks[name][index];
    }

    isMasked(name: LiteralName | StatementName, index: number): boolean {
        if (!~LITERAL_NAMES.indexOf(name)) return false;

        return Array.isArray(this.masks[name]) && Array.isArray(this.masks[name][index]);
    }
}

export type Languages = { [key: LanguageName]: Language };
