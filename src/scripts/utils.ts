import Language, { MASK_NAME_SOURCE, PREFIX } from './Language';
import Token from './Token';
import { IExpression, IPattern } from './types';

const half = (value: number): number => ~~(value / 2);
const getTag = (name: string, text: string): string => `<span class="${PREFIX}${name}">${text}</span>`;

const compare = (left: number, right: number, newToken: Token, tokens: Token[]): number => {
  if (right <= tokens.length && left < right) {
    const existingToken = tokens[right - 1];

    if (existingToken) {
      if (existingToken.end <= newToken.start) {
        return compare(right, right + half(tokens.length - right + 1), newToken, tokens);
      }
      if (existingToken.start >= newToken.end) return compare(left, left + half(right - left), newToken, tokens);
      if (newToken.isIncludedIn(existingToken)) return -Infinity;
      if (existingToken.isIncludedIn(newToken)) return right === 1 ? Infinity : -(right - 1);
      if (existingToken.isCross(newToken)) return Infinity;
    }
  }

  return right;
};

export const parse = (code: string, language: Language): Token[] => {
  let match: RegExpExecArray | null;
  let newToken: Token;
  let tokenIndex = NaN;
  const tokens: Token[] = [];

  language.eachExp((pattern: IPattern, [expression, mask]: IExpression) => {
    while ((match = expression.exec(code))) {
      // TODO: remove !
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      newToken = new Token(pattern, match[0]!, match.index, mask);

      if ((tokenIndex = compare(0, Math.max(half(tokens.length), 1), newToken, tokens)) >= 0) {
        if (Number.isFinite(tokenIndex)) tokens.splice(tokenIndex, 0, newToken);
        else tokens[0] = newToken;
      } else if (Number.isFinite(tokenIndex)) tokens[Math.abs(tokenIndex)] = newToken;
    }
  });

  return tokens;
};

// eslint-disable-next-line max-lines-per-function
const wrap = (token: Token, language: Language, languages: { [key: string]: Language }): string => {
  const name = token.isSource() ? language.keywords[token.value] : token.pattern;
  let result: string;

  if (typeof name === 'undefined') {
    result = token.value;
  } else {
    const { mask } = token;

    if (typeof mask === 'undefined') {
      result = getTag(name, token.value);
    } else if (typeof mask === 'string') {
      result = getTag(`${name} ${PREFIX}${mask}`, token.value);
    } else {
      const [expression, langName = language.name] = mask;
      const regExp = new RegExp(expression, 'gm');
      const parts: string[] = [];
      let match: RegExpExecArray | null;
      let position = 0;

      while ((match = regExp.exec(token.value))) {
        if (match[0]) {
          const lang = languages[langName];

          if (lang) {
            const tokens = parse(match[0], lang);

            parts.push(
              token.value.substring(position, match.index),
              getTag(MASK_NAME_SOURCE, render(match[0], tokens, lang, languages))
            );
            position = regExp.lastIndex;
          }
        }
      }

      parts.push(token.value.substring(position, token.value.length));
      result = getTag(name, parts.join(''));
    }
  }

  return result;
};

export const render = (
  code: string,
  tokens: Token[],
  language: Language,
  languages: { [key: string]: Language }
): string => {
  const stack: string[] = [];
  let position = 0;

  tokens.forEach((token: Token) => {
    if (position < token.start) {
      stack.push(code.substring(position, token.start));
    }

    stack.push(wrap(token, language, languages));
    position = token.end;
  });

  stack.push(code.substring(position));

  return stack.join('');
};
