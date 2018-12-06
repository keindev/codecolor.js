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

    const LITERAL_NAME_COMMENT = 'comment';
    const LITERAL_NAME_TEMPLATE = 'template';
    const LITERAL_NAME_STRING = 'string';
    const LITERAL_NAME_FRAGMENT = 'fragment';
    const LITERAL_NAME_NUMBER = 'number';
    const LITERAL_NAME_OPERATOR = 'operator';
    const STATEMENT_NAME_KEYWORD = 'keyword';
    const STATEMENT_NAME_PRIMITIVE = 'primitive';
    const STATEMENT_NAME_BUILTIN = 'builtin';
    const LITERAL_NAMES = [LITERAL_NAME_COMMENT, LITERAL_NAME_TEMPLATE, LITERAL_NAME_STRING, LITERAL_NAME_NUMBER, LITERAL_NAME_FRAGMENT, LITERAL_NAME_OPERATOR];
    const STATEMENT_NAMES = [STATEMENT_NAME_KEYWORD, STATEMENT_NAME_PRIMITIVE, STATEMENT_NAME_BUILTIN];
    class Language {
      constructor(schema) {
        const getRules = function (names, rules) {
          return names.reduce((accumulator, name) => {
            if (typeof rules[name] !== 'undefined') {
              accumulator.push(rules[name]);
            }

            return accumulator;
          }, []);
        };

        this.literals = getRules(LITERAL_NAMES, schema.literals);
        this.statements = getRules(STATEMENT_NAMES, schema.statements);
        this.masks = typeof schema.masks === 'object' ? schema.masks : {};
      }

      eachLiterals(callback) {
        this.literals.forEach((rule, literalIndex) => {
          rule.forEach((expression, ruleIndex) => {
            callback(LITERAL_NAMES[literalIndex], expression, ruleIndex);
          });
        });
      }

      getStatementName(value) {
        const char = value[0];
        let statement;
        let i = 0;

        while ((statement = this.statements[i]) && !(statement[char] && ~statement[char].indexOf(value))) i++;

        return STATEMENT_NAMES[i];
      }

      getMask(name, index) {
        return this.masks[name][index];
      }

      isMasked(name, index) {
        if (!~LITERAL_NAMES.indexOf(name)) return false;
        return Array.isArray(this.masks[name]) && Array.isArray(this.masks[name][index]);
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

      isIncludeIn(token) {
        return this.start >= token.start && this.end <= token.end;
      }

      isFragment() {
        return this.name === LITERAL_NAME_FRAGMENT;
      }

    }

    const getTag = (className, text) => `<span class="cc-${className}">${text}</span>`;

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
            if (newToken.isIncludeIn(existingToken)) return NaN;
            if (existingToken.isIncludeIn(newToken)) return -(right - 1);
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
        const name = token.isFragment() ? this.language.getStatementName(token.value) : token.name;
        let result;

        if (typeof name === 'undefined') {
          result = token.value;
        } else if (this.language.isMasked(name, token.ruleIndex)) {
          const mask = this.language.getMask(name, token.ruleIndex);
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
        this.languages[schema.name] = new Language(schema);
        this.activeSchema = schema.name;
        return schema.name;
      }

    }

    var library = new Library();

    return library;

})));
