export type ABC =
  | 'A'
  | 'a'
  | 'B'
  | 'b'
  | 'C'
  | 'c'
  | 'D'
  | 'd'
  | 'E'
  | 'e'
  | 'F'
  | 'f'
  | 'G'
  | 'g'
  | 'H'
  | 'h'
  | 'I'
  | 'i'
  | 'J'
  | 'j'
  | 'K'
  | 'k'
  | 'L'
  | 'l'
  | 'M'
  | 'm'
  | 'N'
  | 'n'
  | 'O'
  | 'o'
  | 'P'
  | 'p'
  | 'Q'
  | 'q'
  | 'R'
  | 'r'
  | 'S'
  | 's'
  | 'T'
  | 't'
  | 'U'
  | 'u'
  | 'V'
  | 'v'
  | 'W'
  | 'w'
  | 'X'
  | 'x'
  | 'Y'
  | 'y'
  | 'Z'
  | 'z';
export type MaskName =
  | 'comment'
  | 'template'
  | 'string'
  | 'constant'
  | 'storage'
  | 'attribute'
  | 'operator'
  | 'variable'
  | 'interpolation'
  | 'keyword'
  | 'symbol'
  | 'entity'
  | 'meta'
  | 'source'
  | 'emphasis'
  | 'strong'
  | 'link';
export type LanguageName = string;
export type Expression = string;
export type ExpressionRule = Expression[];
export type KeywordRule = { [key in ABC]?: string[] };
export type MaskRule = [Expression, LanguageName] | MaskName;

export type Rule<T> = {
  names: MaskName[];
  values: T[];
};

export interface ISchema {
  expressions: Rule<ExpressionRule>;
  keywords?: Rule<KeywordRule>;
  masks?: { [key in MaskName]?: MaskRule[] };
  name: LanguageName;
}

export const PREFIX = 'cc-';
export const MASK_NAME_SOURCE: MaskName = 'source';

export default class Language {
  activeExpressions: MaskName[];
  activeKeywords: MaskName[];
  expressions: ExpressionRule[];
  keywords: KeywordRule[];
  masks: ISchema['masks'];
  name: LanguageName;

  constructor({ name, expressions, keywords, masks }: ISchema) {
    this.name = name;
    this.expressions = expressions.values;
    this.activeExpressions = expressions.names;
    this.keywords = typeof keywords === 'object' ? keywords.values : [];
    this.activeKeywords = typeof keywords === 'object' ? keywords.names : [];
    this.masks = masks;
  }

  eachExp(callback: (name: MaskName, expression: string, ruleIndex: number) => void): void {
    this.expressions.forEach((rule: ExpressionRule, expressionIndex: number) => {
      rule.forEach((expression: string, ruleIndex: number) => {
        // TODO: remove eslint fix
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        callback(this.activeExpressions[expressionIndex]!, expression, ruleIndex);
      });
    });
  }

  getKeywordName(value: string): MaskName | undefined {
    const [char] = value;
    let rule: KeywordRule | undefined;
    let i = 0;

    // TODO: remove "as ABC"
    // TODO: remove !
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    while ((rule = this.keywords[i]) && !(rule[char as ABC] && ~rule[char as ABC]!.indexOf(value))) i++;

    return this.activeKeywords[i];
  }

  getMask(name: MaskName, index: number): MaskRule | void {
    let mask: MaskRule | void;

    // TODO: remove !
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (typeof this.masks !== 'undefined' && Array.isArray(this.masks[name]) && !!this.masks[name]![index]) {
      // TODO: remove !
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      mask = this.masks[name]![index];
    }

    return mask;
  }
}
