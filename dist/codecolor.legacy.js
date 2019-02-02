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

    var MASK_NAME_SOURCE = 'source';
    var Language = (function() {
        function Language(name, schema) {
            this.name = name;
            this.expressions = schema.expressions.values;
            this.activeExpressions = schema.expressions.names;
            this.keywords = schema.keywords.values;
            this.activeKeywords = schema.keywords.names;
            this.masks = schema.masks;
        }

        var _proto = Language.prototype;

        _proto.eachExp = function eachExp(callback) {
            var _this = this;

            this.expressions.forEach(function(rule, expressionIndex) {
                rule.forEach(function(expression, ruleIndex) {
                    callback(_this.activeExpressions[expressionIndex], expression, ruleIndex);
                });
            });
        };

        _proto.getKeywordName = function getKeywordName(value) {
            var char = value[0];
            var rule;
            var i = 0;

            while ((rule = this.keywords[i]) && !(rule[char] && ~rule[char].indexOf(value))) {
                i++;
            }

            return this.activeKeywords[i];
        };

        _proto.getMask = function getMask(name, index) {
            var mask;

            if (typeof this.masks !== 'undefined' && Array.isArray(this.masks[name]) && !!this.masks[name][index]) {
                mask = this.masks[name][index];
            }

            return mask;
        };

        return Language;
    })();

    var Token = (function() {
        function Token(name, value, position, ruleIndex) {
            this.name = name;
            this.value = value;
            this.start = position;
            this.end = position + value.length;
            this.ruleIndex = ruleIndex;
        }

        var _proto = Token.prototype;

        _proto.isIncludedIn = function isIncludedIn(token) {
            return this.start >= token.start && this.end <= token.end;
        };

        _proto.isCross = function isCross(token) {
            return this.start >= token.start && this.start <= token.end && this.end >= token.end;
        };

        _proto.isSource = function isSource() {
            return this.name === MASK_NAME_SOURCE;
        };

        return Token;
    })();

    var Parser = (function() {
        Parser.parse = function parse(code, name, languages) {
            var parser = new Parser(code, name, languages);
            parser.analize();
            return parser.render();
        };

        function Parser(code, name, languages) {
            this.code = code;
            this.languages = languages;
            this.language = languages[name];
            this.tokens = [];
        }

        var _proto = Parser.prototype;

        _proto.analize = function analize() {
            var _this = this;

            var match;
            var regExp;
            var newToken;
            var existingToken;
            var tokenIndex = NaN;
            var tokens = this.tokens;

            var half = function half(value) {
                return ~~(value / 2);
            };

            var compare = function compare(left, right) {
                if (right <= tokens.length && left < right) {
                    existingToken = tokens[right - 1];
                    if (existingToken.end <= newToken.start)
                        return compare(right, right + half(tokens.length - right + 1));
                    if (existingToken.start >= newToken.end) return compare(left, left + half(right - left));
                    if (newToken.isIncludedIn(existingToken)) return NaN;
                    if (existingToken.isIncludedIn(newToken)) return right === 1 ? 0 : -(right - 1);
                    if (existingToken.isCross(newToken)) return -(right - 1);
                }

                return right;
            };

            this.language.eachExp(function(name, expression, ruleIndex) {
                regExp = new RegExp(expression, 'gm');

                while ((match = regExp.exec(_this.code))) {
                    newToken = new Token(name, match[0], match.index, ruleIndex);

                    if ((tokenIndex = compare(0, Math.max(half(tokens.length), 1))) >= 0) {
                        if (tokenIndex === 0 && Math.atan2(tokenIndex, tokenIndex) < 0) {
                            tokens[Math.abs(tokenIndex)] = newToken;
                        } else {
                            tokens.splice(tokenIndex, 0, newToken);
                        }
                    } else {
                        tokens[Math.abs(tokenIndex)] = newToken;
                    }
                }
            });
        };

        _proto.wrap = function wrap(token) {
            var getTag = function getTag(className, text) {
                return '<span class="cc-' + className + '">' + text + '</span>';
            };

            var name = token.isSource() ? this.language.getKeywordName(token.value) : token.name;
            var result;

            if (typeof name === 'undefined') {
                result = token.value;
            } else {
                var mask = this.language.getMask(name, token.ruleIndex);

                if (typeof mask === 'undefined') {
                    result = getTag(name, token.value);
                } else if (typeof mask === 'string') {
                    result = getTag(mask, token.value);
                } else {
                    var regExp = new RegExp(mask[0], 'gm');
                    var parts = [];
                    var position = 0;
                    var match;

                    while ((match = regExp.exec(token.value))) {
                        parts.push(
                            token.value.substring(position, match.index),
                            getTag(mask[2], Parser.parse(match[0], mask[1], this.languages))
                        );
                        position = regExp.lastIndex;
                    }

                    parts.push(token.value.substring(position, token.value.length));
                    result = getTag(name, parts.join(''));
                }
            }

            return result;
        };

        _proto.render = function render() {
            var _this2 = this;

            var position = 0;
            var stack = [];
            this.tokens.forEach(function(token) {
                if (position < token.start) {
                    stack.push(_this2.code.substring(position, token.start));
                }

                stack.push(_this2.wrap(token));
                position = token.end;
            });
            stack.push(this.code.substring(position));
            return stack.join('');
        };

        return Parser;
    })();

    var version = '1.0.0';

    var Library = (function() {
        function Library() {
            Object.defineProperty(this, 'version', {
                enumerable: true,
                writable: true,
                value: version,
            });
            Object.defineProperty(this, 'languages', {
                enumerable: true,
                writable: true,
                value: {},
            });
        }

        var _proto = Library.prototype;

        _proto.highlight = function highlight(code, schemaName) {
            return [
                '<pre><code class="cc-container">',
                Parser.parse(code, schemaName || this.activeSchema, this.languages),
                '</code></pre>',
            ].join('');
        };

        _proto.addSchema = function addSchema(schema) {
            this.languages[schema.name] = new Language(schema.name, schema);
            this.activeSchema = schema.name;
            return schema.name;
        };

        return Library;
    })();

    var library = new Library();

    return library;
});
