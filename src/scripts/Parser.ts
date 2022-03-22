import Language, { LanguageName, MASK_NAME_SOURCE, MaskName, MaskRule, PREFIX } from './Language';
import Token from './Token';

export type Languages = { [key: LanguageName]: Language };

export default class Parser {
  code: string;
  language: Language;
  languages: Languages;
  tokens: Token[];

  constructor(code: string, name: LanguageName, languages: Languages) {
    this.code = code;
    this.languages = languages;
    // TODO: remove !
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.language = languages[name]!;
    this.tokens = [];
  }

  static parse(code: string, name: LanguageName, languages: Languages): string {
    let result: string = code;

    if (typeof languages[name] !== 'undefined') {
      const parser = new Parser(result, name, languages);

      parser.analyze();
      result = parser.render();
    }

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  analyze(): void {
    let match: RegExpExecArray | null;
    let regExp: RegExp;
    let newToken: Token;
    let existingToken: Token;
    let tokenIndex = NaN;
    const { tokens } = this;
    const half = (value: number): number => ~~(value / 2);
    const compare = (left: number, right: number): number => {
      if (right <= tokens.length && left < right) {
        // TODO: remove !
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        existingToken = tokens[right - 1]!;

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
        // TODO: remove !
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        newToken = new Token(name, match[0]!, match.index, ruleIndex);

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

  render(): string {
    const stack: string[] = [];
    let position = 0;

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

  wrap(token: Token): string {
    const getTag = (name: string, text: string): string => `<span class="${PREFIX}${name}">${text}</span>`;
    const name: MaskName | void = token.isSource() ? this.language.getKeywordName(token.value) : token.name;
    let result: string;

    if (typeof name === 'undefined') {
      result = token.value;
    } else {
      const mask: MaskRule | void = this.language.getMask(name, token.ruleIndex);

      if (typeof mask === 'undefined') {
        result = getTag(name, token.value);
      } else if (typeof mask === 'string') {
        result = getTag(`${name} ${PREFIX}${mask}`, token.value);
      } else {
        const [expression, language] = mask;
        const regExp = new RegExp(expression, 'gm');
        const parts: string[] = [];
        let position = 0;
        let match: RegExpExecArray | null;

        while ((match = regExp.exec(token.value))) {
          parts.push(
            token.value.substring(position, match.index),
            // TODO: remove !
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            getTag(MASK_NAME_SOURCE, Parser.parse(match[0]!, language, this.languages))
          );
          position = regExp.lastIndex;
        }

        parts.push(token.value.substring(position, token.value.length));
        result = getTag(name, parts.join(''));
      }
    }

    return result;
  }
}
