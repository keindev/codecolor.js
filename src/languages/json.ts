import { ISchema } from '../scripts/Language';

const json: ISchema = {
  name: 'json',
  expressions: [
    ['variable', [[/(")(?:(?=(\\?))\2.)*?\1(?=:)/gm]]],
    ['string', [[/(")(?:(?=(\\?))\2.)*?\1/gm]]],
    ['constant', [[/(?<=[,:[]\s*)\d*\.?\d+/gm]]],
    ['operator', [[/(?<=[,:[]\s*)(true|false)/gm]]],
  ],
};

export default json;
