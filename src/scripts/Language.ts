import { IExpression, IKeywordsMap, IPattern } from './types';

export interface ISchema {
  expressions: [IPattern, IExpression[]][];
  keywords?: [IPattern, string[]][];
  name: string;
}

export const PREFIX = 'cc-';
export const MASK_NAME_SOURCE: IPattern = 'source';

export default class Language {
  expressions: Map<IPattern, IExpression[]>;
  keywords: IKeywordsMap;
  name: string;

  constructor({ name, expressions, keywords = [] }: ISchema) {
    this.name = name;
    this.expressions = new Map(expressions);
    this.keywords = Object.fromEntries(
      keywords.reduce(
        (acc, [pattern, words]) => [...acc, ...words.map(word => [word, pattern] as [string, IPattern])],
        [] as [string, IPattern][]
      )
    );
  }

  eachExp(callback: (pattern: IPattern, expression: IExpression) => void): void {
    this.expressions.forEach((rules, pattern) => {
      rules.forEach((expression: IExpression) => {
        callback(pattern, expression);
      });
    });
  }
}
