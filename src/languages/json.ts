import { ISyntax } from '../types.js';

const json: ISyntax = {
  name: 'json',
  expressions: [
    ['variable', [[/(")(?:(?=(\\?))\2.)*?\1(?=:)/gm]]],
    ['string', [[/(")(?:(?=(\\?))\2.)*?\1/gm]]],
    ['constant', [[/(?<=[,:[]\s*)\d*\.?\d+/gm]]],
    ['operator', [[/(?<=[,:[]\s*)(true|false)/gm]]],
  ],
};

export default json;
