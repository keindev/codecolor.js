/* @flow */

export const literals = {
    comment: 'comment',
    template: 'template',
    string: 'string',
    fragment: 'fragment',
    number: 'number',
    operator: 'operator',
};

export const statements = {
    keyword: 'keyword',
    primitive: 'primitive',
    builtin: 'builtin',
};

export type LanguageName = string;

export type LiteralName = $Keys<typeof literals>;
export type LiteralRule = string[];
export type Literals = { [ key: LiteralName ]: LiteralRule };

export type StatementName = $Keys<typeof statements>;
export type StatementRuleName = 'A' | 'a' | 'B' | 'b' | 'C' | 'c' | 'D' | 'd' | 'E' | 'e' | 'F' | 'f' | 'G' | 'g' |
        'H' | 'h' | 'I' | 'i' | 'J' | 'j' | 'K' | 'k' | 'L' | 'l' | 'M' | 'm' | 'N' | 'n' | 'O' | 'o' | 'P' | 'p' |
        'Q' | 'q' | 'R' | 'r' | 'S' | 's' | 'T' | 't' | 'U' | 'u' | 'V' | 'v' | 'W' | 'w' | 'X' | 'x' | 'Y' | 'y' |
        'Z' | 'z';
export type StatementRule = { [ StatementRuleName ]: LiteralRule };
export type Statements = { [ key: StatementName ]: StatementRule };

export type MaskRule = [string, LanguageName];
export type Masks = { [ key: LiteralName | StatementName ]: MaskRule[] };

export interface ISchema {
    name: LanguageName;
    literals: Literals;
    statements: Statements;
    masks: Masks;
}

export class Language {
    name: LanguageName;
    literalNames: LiteralName[];
    statementNames: StatementName[]
    literalRules: LiteralRule[];
    statementRules: StatementRule[];
    masks: Masks;

    constructor(name: LanguageName, schema: $ReadOnly<ISchema>) {
        // TODO: remove getRules?! Create lang tests & transform [LANG].js to [LANG].json
        this.name = name;
        this.literalRules = [];
        this.literalNames = [];
        this.statementRules = [];
        this.statementNames = [];
        this.masks = {};

        Object.keys(literals).forEach((literalName: LiteralName) => {
            if (schema.literals[literalName]) {
                this.literalRules.push(schema.literals[literalName]);
                this.literalNames.push(literalName);

                if (schema.masks[literalName]) {
                    this.masks[literalName] = schema.masks[literalName];
                }
            }
        });

        Object.keys(statements).forEach((statementName: StatementName) => {
            if (schema.statements[statementName]) {
                this.statementRules.push(schema.statements[statementName]);
                this.statementNames.push(statementName);
            }
        });
    }

    eachLiterals(callback: (name: LiteralName, expression: string, ruleIndex: number) => void) {
        this.literalRules.forEach((rule: LiteralRule, literalIndex: number) => {
            rule.forEach((expression: string, ruleIndex: number) => {
                callback(this.literalNames[literalIndex], expression, ruleIndex);
            });
        });
    }

    getStatementName(value: string): StatementName | void {
        const char: any = value[0];
        let statement: StatementRule;
        let i: number = 0;

        while ((statement = this.statementRules[i]) && !(statement[char] && ~statement[char].indexOf(value))) i++;

        return this.statementNames[i];
    }

    getMask(name: LiteralName | StatementName, index: number): MaskRule {
        return this.masks[name][index];
    }

    isMasked(name: LiteralName | StatementName, index: number): boolean {
        return Array.isArray(this.masks[name]) && Array.isArray(this.masks[name][index]);
    }
}
