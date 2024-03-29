import { ISyntax } from '../types.js';

const javascript: ISyntax = {
  name: 'javascript',
  expressions: [
    ['comment', [[/\/\*[\S\s]*?\*\/|\/\/.*$/gm, 'emphasis']]],
    [
      'string',
      [
        [/(["'])(?:(?=(\\?))\2.)*?\1/gm],
        // eslint-disable-next-line no-control-regex
        [/\/[\x00-\x7F]\S*\/[gimsu]*/gm],
      ],
    ],
    [
      'variable',
      [
        [
          /\${(?:[^{}]{1,3}|{(?:[^{}]{1,3}|{[^{}]{1,3}})*})*}/gm,
          [/(?<=\${)(?:[^{}]{1,3}|{(?:[^{}]{1,3}|{[^{}]{1,3}})*})*(?=})/gm],
        ],
        [/(?<=\.)\w+\d*(?!\(|\w)/gm],
        [/^\s*\w+(?=:)/gm],
      ],
    ],
    ['template', [[/(``)|(`.+?\${[\S\s]+?}`)|(`[\S\s]+?`)/gm, [/\${(?:[^{}]{1,3}|{(?:[^{}]{1,3}|{[^{}]*})*})*}/gm]]]],
    ['entity', [[/(?<=function[\t ]+)[A-Za-z]+\w*(?=[\t ]*\()/gm], [/((?<=\.)|(?<!new[\t ]+))\w+\d*(?=\()/gm]]],
    ['constant', [[/\d*[,.]?\d+(?:[EXex]-?[\dA-F]+)?/gm], [/(?<=(clas{2}|new)\s+)\w+\d*(?=\s+{|\()/gm]]],
    ['symbol', [[/(?<=\))[\t ]*=>/gm]]],
    ['operator', [[/=>|={1,3}|[&+|~-]{1,2}|[!%*+/:<>?-]=?/gm]]],
    ['source', [[/(?<!\.)\w{2,}\d*/gm]]],
  ],
  keywords: [
    ['constant', ['false', 'null', 'true', 'undefined']],
    [
      'keyword',
      [
        'as',
        'async',
        'await',
        'break',
        'case',
        'catch',
        'const',
        'continue',
        'class',
        'constructor',
        'debugger',
        'default',
        'delete',
        'do',
        'else',
        'export',
        'finally',
        'for',
        'from',
        'function',
        'if',
        'import',
        'in',
        'instanceof',
        'let',
        'new',
        'of',
        'return',
        'static',
        'super',
        'switch',
        'this',
        'throw',
        'try',
        'typeof',
        'var',
        'void',
        'while',
        'with',
        'yield',
      ],
    ],
    [
      'meta',
      [
        'Array',
        'ArrayBuffer',
        'Boolean',
        'DataView',
        'Date',
        'Error',
        'EvalError',
        'Float32Array',
        'Float64Array',
        'Function',
        'Infinity',
        'Int16Array',
        'Int32Array',
        'Int8Array',
        'InternalError',
        'Intl',
        'JSON',
        'Map',
        'Math',
        'Number',
        'NaN',
        'Object',
        'Promise',
        'Proxy',
        'RangeError',
        'ReferenceError',
        'Reflect',
        'RegExp',
        'Set',
        'StopIteration',
        'String',
        'Symbol',
        'SyntaxError',
        'TypeError',
        'URIError',
        'Uint16Array',
        'Uint32Array',
        'Uint8Array',
        'Uint8ClampedArray',
        'WeakMap',
        'WeakSet',
        'arguments',
        'console',
        'decodeURI',
        'decodeURIComponent',
        'document',
        'encodeURI',
        'encodeURIComponent',
        'escape',
        'eval',
        'isFinite',
        'isNaN',
        'module',
        'parseFloat',
        'parseInt',
        'require',
        'unescape',
        'window',
      ],
    ],
  ],
};

export default javascript;
