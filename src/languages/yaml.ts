import { ISyntax } from '../types.js';

const yaml: ISyntax = {
  name: 'yaml',
  expressions: [
    ['comment', [[/#([\t ])*.*$/gm]]],
    ['string', [[/(["'])(?:(?=(\\?))\2.)*?\1/gm]]],
    ['variable', [[/[A-Za-z]+\w+(?=:)/gm]]],
    [
      'constant',
      [
        [
          // eslint-disable-next-line max-len
          /(?<=[,:[{-]\s*(?:!\S+)?[\t ]*)(?:\d{4}-\d\d?-\d\d?(?:[Tt]|[\t ]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?[\t ]*(?:Z|[+-]\d\d?(?::\d{2})?)?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?)(?=[\t ]*(?:$|,|]|}))/gm,
        ],
        [/(?<=[\t ]*)\d+/gm],
        [/(?<=:[\t ]*)true|false|null/gm],
      ],
    ],
    ['entity', [[/(?<= )(&|\*)\w+/gm]]],
    ['operator', [[/^---/gm], [/\||>/gm]]],
  ],
};

export default yaml;
