import Language from '../../scripts/Language';
import { IExpression, IPattern } from '../../scripts/types';

describe('Language', () => {
  const TEST_LANGUAGE_NAME = 'test';
  const TEST_EXPRESSION_NAME: IPattern = 'template';
  const TEST_EXPRESSION_VALUE = /_/gm;
  const TEST_KEYWORD_NAME: IPattern = 'meta';
  const TEST_KEYWORD_VALUE = 'test';
  const expressions: [IPattern, IExpression[]][] = [[TEST_EXPRESSION_NAME, [[TEST_EXPRESSION_VALUE]]]];
  const keywords: [IPattern, string[]][] = [[TEST_KEYWORD_NAME, [TEST_KEYWORD_VALUE]]];
  const language = new Language({ name: TEST_LANGUAGE_NAME, expressions, keywords });

  it('creating', () => {
    expect(language.expressions.size).toBe(expressions.length);
    expect(Object.keys(language.keywords).length).toBe(keywords.reduce((acc, [, values]) => acc + values.length, 0));
  });

  it('each expressions', () => {
    language.eachExp((name, expression) => {
      expect(name).toBe(TEST_EXPRESSION_NAME);
      expect(expression).toEqual([TEST_EXPRESSION_VALUE]);
    });
  });

  it('find keyword by name', () => {
    expect(language.keywords[TEST_KEYWORD_VALUE]).toBe(TEST_KEYWORD_NAME);
  });
});
