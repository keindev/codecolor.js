/*!
 * Codecolor.js v1.0.0
 * https://codecolorjs.pw/
 *
 * (c) 2018-2019 Daniil Ryazanov <opensource@tagproject.ru>
 * Released under the MIT License.
 */

(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
        ? define(factory)
        : ((global = global || self), (global.codecolor = factory()));
})(this, function() {
    'use strict';

    const PREFIX = 'cc-';
    const MASK_NAME_SOURCE = 'source';
    class Language {
        constructor(name, schema) {
            this.name = void 0;
            this.expressions = void 0;
            this.keywords = void 0;
            this.masks = void 0;
            this.activeKeywords = void 0;
            this.activeExpressions = void 0;
            this.name = name;
            this.expressions = schema.expressions.values;
            this.activeExpressions = schema.expressions.names;
            this.keywords = typeof schema.keywords === 'object' ? schema.keywords.values : [];
            this.activeKeywords = typeof schema.keywords === 'object' ? schema.keywords.names : [];
            this.masks = schema.masks;
        }

        eachExp(callback) {
            this.expressions.forEach((rule, expressionIndex) => {
                rule.forEach((expression, ruleIndex) => {
                    callback(this.activeExpressions[expressionIndex], expression, ruleIndex);
                });
            });
        }

        getKeywordName(value) {
            const char = value[0];
            let rule;
            let i = 0;

            while ((rule = this.keywords[i]) && !(rule[char] && ~rule[char].indexOf(value))) i++;

            return this.activeKeywords[i];
        }

        getMask(name, index) {
            let mask;

            if (typeof this.masks !== 'undefined' && Array.isArray(this.masks[name]) && !!this.masks[name][index]) {
                mask = this.masks[name][index];
            }

            return mask;
        }
    }

    class Token {
        constructor(name, value, position, ruleIndex) {
            this.name = void 0;
            this.value = void 0;
            this.start = void 0;
            this.end = void 0;
            this.ruleIndex = void 0;
            this.name = name;
            this.value = value;
            this.start = position;
            this.end = position + value.length;
            this.ruleIndex = ruleIndex;
        }

        isIncludedIn(token) {
            return this.start >= token.start && this.end <= token.end;
        }

        isCross(token) {
            return this.start >= token.start && this.start <= token.end && this.end >= token.end;
        }

        isSource() {
            return this.name === MASK_NAME_SOURCE;
        }
    }

    class Parser {
        static parse(code, name, languages) {
            const parser = new Parser(code, name, languages);
            parser.analize();
            return parser.render();
        }

        constructor(code, name, languages) {
            this.code = void 0;
            this.languages = void 0;
            this.language = void 0;
            this.tokens = void 0;
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
            const { tokens } = this;

            const half = value => ~~(value / 2);

            const compare = (left, right) => {
                if (right <= tokens.length && left < right) {
                    existingToken = tokens[right - 1];
                    if (existingToken.end <= newToken.start)
                        return compare(right, right + half(tokens.length - right + 1));
                    if (existingToken.start >= newToken.end) return compare(left, left + half(right - left));
                    if (newToken.isIncludedIn(existingToken)) return -Infinity;
                    if (existingToken.isIncludedIn(newToken)) return right === 1 ? Infinity : -(right - 1);
                    if (existingToken.isCross(newToken)) return Infinity;
                }

                return right;
            };

            this.language.eachExp((name, expression, ruleIndex) => {
                regExp = new RegExp(expression, 'gm');

                while ((match = regExp.exec(this.code))) {
                    newToken = new Token(name, match[0], match.index, ruleIndex);

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

        wrap(token) {
            const getTag = (name, text) => `<span class="${PREFIX}${name}">${text}</span>`;

            const name = token.isSource() ? this.language.getKeywordName(token.value) : token.name;
            let result;

            if (typeof name === 'undefined') {
                result = token.value;
            } else {
                const mask = this.language.getMask(name, token.ruleIndex);

                if (typeof mask === 'undefined') {
                    result = getTag(name, token.value);
                } else if (typeof mask === 'string') {
                    result = getTag(`${name} ${PREFIX}${mask}`, token.value);
                } else {
                    const [expression, language, maskName] = mask;
                    const regExp = new RegExp(expression, 'gm');
                    const parts = [];
                    let position = 0;
                    let match;

                    while ((match = regExp.exec(token.value))) {
                        parts.push(
                            token.value.substring(position, match.index),
                            getTag(maskName || MASK_NAME_SOURCE, Parser.parse(match[0], language, this.languages))
                        );
                        position = regExp.lastIndex;
                    }

                    parts.push(token.value.substring(position, token.value.length));
                    result = getTag(name, parts.join(''));
                }
            }

            return result;
        }

        render() {
            const stack = [];
            let position = 0;
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

    var version = '1.0.0';

    class Library {
        constructor() {
            this.version = version;
            this.languages = {};
            this.activeSchema = void 0;
        }

        highlight(code, schemaName) {
            return [
                `<pre><code class="${PREFIX}container">`,
                Parser.parse(code, schemaName || this.activeSchema, this.languages),
                '</code></pre>',
            ].join('');
        }

        addSchema(schema) {
            this.languages[schema.name] = new Language(schema.name, schema);
            this.activeSchema = schema.name;
            return schema.name;
        }
    }

    var library = new Library();

    return library;
});
