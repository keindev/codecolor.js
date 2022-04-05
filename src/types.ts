export type IChar =
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

export type IPattern =
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

export type ILanguageName = 'bash' | 'css' | 'javascript' | 'json' | 'scss' | 'yaml';
export type IMask = IPattern | [RegExp, ILanguageName] | [RegExp];
export type IExpression = [RegExp, IMask] | [RegExp];
export type IKeywordsMap = { [key: string]: IPattern };

export interface ILanguage {
  expressions: Map<IPattern, IExpression[]>;
  keywords: IKeywordsMap;
  name: ILanguageName;
}

export interface ISyntax {
  expressions: [IPattern, IExpression[]][];
  keywords?: [IPattern, string[]][];
  name: ILanguageName;
}

export interface IToken {
  end: number;
  mask?: IMask;
  pattern: IPattern;
  start: number;
  value: string;
}

export interface IRenderOptions {
  keywords: IKeywordsMap;
  language: ILanguageName;
  mask?: IMask;
  pattern: IPattern;
  value: string;
}
