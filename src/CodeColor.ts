import { ILanguage, ILanguageName, IPattern, IRenderOptions, ISyntax, IToken } from './types.js';
import { compare, half } from './utils.js';

class CodeColor {
  readonly languages: Map<string, ILanguage> = new Map();
  readonly prefix: string;

  constructor(prefix = 'cc-') {
    this.prefix = prefix;
  }

  highlight(code: string, language: ILanguageName): string {
    return [`<pre><code class="${this.prefix}container">`, this.parse(code, language), '</code></pre>'].join('');
  }

  register(syntaxes: ISyntax[]): void {
    syntaxes.forEach(({ name, expressions, keywords = [] }) =>
      this.languages.set(name, {
        name,
        expressions: new Map(expressions),
        keywords: Object.fromEntries(
          keywords.reduce(
            (acc, [pattern, words]) => [...acc, ...words.map(word => [word, pattern] as [string, IPattern])],
            [] as [string, IPattern][]
          )
        ),
      })
    );
  }

  private parse(code: string, language: ILanguageName): string {
    const { expressions, keywords = {} } = this.languages.get(language) ?? {};
    const tokens: IToken[] = [];
    const stack: string[] = [];
    let match: RegExpExecArray | null;
    let token: IToken;
    let position = NaN;

    if (!expressions) return code;

    expressions.forEach((rules, pattern) => {
      rules.forEach(([expression, mask]) => {
        while ((match = expression.exec(code))) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          token = { pattern, value: match[0]!, start: match.index, mask, end: match.index + match[0]!.length };

          if ((position = compare(0, Math.max(half(tokens.length), 1), token, tokens)) >= 0) {
            if (Number.isFinite(position)) tokens.splice(position, 0, token);
            else tokens[0] = token;
          } else if (Number.isFinite(position)) tokens[Math.abs(position)] = token;
        }
      });
    });

    stack.push(
      code.substring(
        tokens.reduce((acc, { start, end, pattern, value, mask }) => {
          if (acc < start) stack.push(code.substring(acc, start));

          stack.push(this.render({ pattern, value, keywords, language, mask }));

          return end;
        }, 0)
      )
    );

    return stack.join('');
  }

  private render({ pattern, value, keywords, language, mask }: IRenderOptions): string {
    const name = pattern === 'source' ? keywords[value] : pattern;

    if (!name) return value;
    if (!mask) return this.tag(value, [name]);
    if (typeof mask === 'string') return this.tag(value, [name, mask]);

    const [expression, maskLanguage = language] = mask;
    const regExp = new RegExp(expression, 'gm');
    const parts: string[] = [];
    let match: RegExpExecArray | null;
    let position = 0;

    while ((match = regExp.exec(value))) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parts.push(value.substring(position, match.index), this.tag(this.parse(match[0]!, maskLanguage), ['source']));
      position = regExp.lastIndex;
    }

    parts.push(value.substring(position, value.length));

    return this.tag(parts.join(''), [name]);
  }

  private tag(str: string, patterns: IPattern[]): string {
    const className = patterns?.map(pattern => `${this.prefix}${pattern}`).join(' ');

    return `<span class="${className}">${str}</span>`;
  }
}

export default CodeColor;
