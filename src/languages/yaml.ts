import { ISchema } from '../scripts/Language';

const yaml: ISchema = {
  name: 'yaml',
  expressions: {
    names: ['comment', 'string', 'variable', 'constant', 'entity', 'operator'],
    values: [
      ['#([ \\t])*.*$'],
      ['(["\'])(?:(?=(\\\\?))\\2.)*?\\1'],
      ['[a-zA-Z]+\\w+(?=:)'],
      [
        // eslint-disable-next-line max-len
        '(?<=[:\\-,[{]\\s*(?:![^\\s]+)?[ \\t]*)(?:\\d{4}-\\d\\d?-\\d\\d?(?:[tT]|[ \\t]+)\\d\\d?:\\d{2}:\\d{2}(?:\\.\\d*)?[ \\t]*(?:Z|[-+]\\d\\d?(?::\\d{2})?)?|\\d{4}-\\d{2}-\\d{2}|\\d\\d?:\\d{2}(?::\\d{2}(?:\\.\\d*)?)?)(?=[ \\t]*(?:$|,|]|}))',
        '(?<=[ \\t]*)\\d+',
        '(?<=:[ \\t]*)true|false|null',
      ],
      ['(?<= )(&|\\*)\\w+'],
      ['^---', '\\||>'],
    ],
  },
};

export default yaml;
