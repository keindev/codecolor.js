import Language, { Expression, MaskName } from '../../scripts/Language';

const TEST_LANGUAGE_NAME = 'test';
const TEST_EXPRESSION_NAME: MaskName = 'template';
const TEST_EXPRESSION_VALUE: Expression = 'regExp';
const TEST_KEYWORD_NAME: MaskName = 'meta';
const TEST_KEYWORD_VALUE = 'test';
const TEST_RULE_INDEX = 0;

const schema = {
  name: TEST_LANGUAGE_NAME,
  expressions: {
    names: [TEST_EXPRESSION_NAME],
    values: [[TEST_EXPRESSION_VALUE]],
  },
  keywords: {
    names: [TEST_KEYWORD_NAME],
    values: [
      {
        t: [TEST_KEYWORD_VALUE],
      },
    ],
  },
};
const language = new Language(schema);

describe('Language', () => {
  it('creating', () => {
    expect(language.expressions.length).toBe(schema.expressions.values.length);
    expect(language.activeExpressions.length).toEqual(schema.expressions.names.length);
    expect(language.keywords.length).toBe(schema.keywords.values.length);
    expect(language.activeKeywords.length).toEqual(schema.keywords.names.length);
    expect(language.masks).toBeUndefined();
  });

  it('each expressions', () => {
    language.eachExp((name, expression, ruleIndex) => {
      expect(name).toBe(TEST_EXPRESSION_NAME);
      expect(expression).toBe(TEST_EXPRESSION_VALUE);
      expect(ruleIndex).toBe(TEST_RULE_INDEX);
    });
  });

  it('find keyword by name', () => {
    expect(language.getKeywordName(TEST_KEYWORD_VALUE)).toBe(TEST_KEYWORD_NAME);
  });
});
