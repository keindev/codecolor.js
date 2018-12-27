/*!
 * Codecolor.js v1.0.0
 * https://codecolorjs.pw/
 *
 * (c) 2018-2018 Daniil Ryazanov <opensource@tagproject.ru>
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.codecolor = factory());
}(this, (function () { 'use strict';

    const literals = {
      comment: 'comment',
      template: 'template',
      string: 'string',
      fragment: 'fragment',
      number: 'number',
      operator: 'operator'
    };
    const statements = {
      keyword: 'keyword',
      primitive: 'primitive',
      builtin: 'builtin'
    };
    class Language {
      constructor(name, schema) {
        // TODO: remove getRules?! Create lang tests & transform [LANG].js to [LANG].json
        this.name = name;
        this.literalRules = [];
        this.literalNames = [];
        this.statementRules = [];
        this.statementNames = [];
        this.masks = {};
        Object.keys(literals).forEach(literalName => {
          if (schema.literals[literalName]) {
            this.literalRules.push(schema.literals[literalName]);
            this.literalNames.push(literalName);

            if (schema.masks[literalName]) {
              this.masks[literalName] = schema.masks[literalName];
            }
          }
        });
        Object.keys(statements).forEach(statementName => {
          if (schema.statements[statementName]) {
            this.statementRules.push(schema.statements[statementName]);
            this.statementNames.push(statementName);
          }
        });
      }

      eachLiterals(callback) {
        this.literalRules.forEach((rule, literalIndex) => {
          rule.forEach((expression, ruleIndex) => {
            callback(this.literalNames[literalIndex], expression, ruleIndex);
          });
        });
      }

      getStatementName(value) {
        const char = value[0];
        let statement;
        let i = 0;

        while ((statement = this.statementRules[i]) && !(statement[char] && ~statement[char].indexOf(value))) i++;

        return this.statementNames[i];
      }

      getMask(name, index) {
        return this.masks[name][index];
      }

      isMasked(name, index) {
        return Array.isArray(this.masks[name]) && !!this.masks[name][index];
      }

    }

    class Token {
      constructor(name, value, position, ruleIndex) {
        this.name = name;
        this.value = value;
        this.start = position;
        this.end = position + value.length;
        this.ruleIndex = ruleIndex;
      }

      isIncludedIn(token) {
        return this.start >= token.start && this.end <= token.end;
      }

      isFragment() {
        return this.name === literals.fragment;
      }

    }

    class Parser {
      static parse(code, name, languages) {
        const parser = new Parser(code, name, languages);
        parser.analize();
        return parser.render();
      }

      constructor(code, name, languages) {
        this.code = code;
        this.languages = languages;
        this.language = languages[name];
        this.tokens = [];
      }

      analize() {
        let match;
        let regExp;
        let newToken;
        let existingToken;
        let tokenIndex = NaN;
        const {
          tokens
        } = this;

        const half = value => ~~(value / 2);

        const compare = (left, right) => {
          if (right <= tokens.length && left < right) {
            existingToken = tokens[right - 1];
            if (existingToken.end <= newToken.start) return compare(right, right + half(tokens.length - right + 1));
            if (existingToken.start >= newToken.end) return compare(left, left + half(right - left));
            if (newToken.isIncludedIn(existingToken)) return NaN;
            if (existingToken.isIncludedIn(newToken)) return -(right - 1);
          }

          return right;
        };

        this.language.eachLiterals((name, expression, ruleIndex) => {
          regExp = new RegExp(expression, 'gm');

          while (match = regExp.exec(this.code)) {
            newToken = new Token(name, match[0], match.index, ruleIndex);

            if ((tokenIndex = compare(0, Math.max(half(tokens.length), 1))) >= 0) {
              tokens.splice(tokenIndex, 0, newToken);
            } else {
              tokens[Math.abs(tokenIndex)] = newToken;
            }
          }
        });
      }

      wrap(token) {
        const getTag = (className, text) => `<span class="cc-${className}">${text}</span>`;

        const name = token.isFragment() ? this.language.getStatementName(token.value) : token.name;
        let result;

        if (typeof name === 'undefined') {
          result = token.value;
        } else if (this.language.isMasked(name, token.ruleIndex)) {
          const mask = this.language.getMask(name, token.ruleIndex);

          if (Array.isArray(mask)) {
            const regExp = new RegExp(mask[0], 'gm');
            const parts = [];
            let position = 0;
            let match;

            while (match = regExp.exec(token.value)) {
              parts.push(token.value.substring(position, match.index), getTag(`${name}-mask-${token.ruleIndex}`, Parser.parse(match[0], mask[1], this.languages)));
              position = regExp.lastIndex;
            }

            parts.push(token.value.substring(position, token.value.length));
            result = getTag(name, parts.join(''));
          } else {
            result = getTag(`${name}-mask-${mask}`, token.value);
          }
        } else {
          result = getTag(name, token.value);
        }

        return result;
      }

      render() {
        let position = 0;
        const stack = [];
        this.tokens.forEach(token => {
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

    var version = "1.0.0";

    class Library {
      constructor() {
        Object.defineProperty(this, "version", {
          enumerable: true,
          writable: true,
          value: version
        });
        Object.defineProperty(this, "languages", {
          enumerable: true,
          writable: true,
          value: {}
        });
      }

      highlight(code, schemaName) {
        return ['<pre><code class="cc-container">', Parser.parse(code, schemaName || this.activeSchema, this.languages), '</code></pre>'].join('');
      }

      addSchema(schema) {
        this.languages[schema.name] = new Language(schema.name, schema);
        this.activeSchema = schema.name;
        return schema.name;
      }

    }

    var library = new Library();

    return library;

})));
