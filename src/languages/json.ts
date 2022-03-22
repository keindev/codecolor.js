import { ISchema } from '../scripts/Language';

const json: ISchema = {
  name: 'json',
  expressions: {
    names: ['variable', 'string', 'constant', 'operator'],
    values: [
      ['(")(?:(?=(\\\\?))\\2.)*?\\1(?=:)'],
      ['(")(?:(?=(\\\\?))\\2.)*?\\1'],
      ['(?<=[\\:[,]\\s*)\\d*[.]?\\d+'],
      ['(?<=[\\:[,]\\s*)(true|false)'],
    ],
  },
};

export default json;
