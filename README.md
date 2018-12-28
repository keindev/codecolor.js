## Cautions:

 - Regular expressions of language files use "Lookbehind Assertions" (see [proposal-regexp-lookbehind](https://github.com/tc39/proposal-regexp-lookbehind)).
 - Due to the lack of a PCRE recursive parameter <code>(?R)</code>, nested structures (for example ["Template literals"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)) have a maximum nesting equal to two.
