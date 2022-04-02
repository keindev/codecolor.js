import Language, { ISchema, PREFIX } from './Language';
import { parse, render } from './utils';

class Library {
  languages: { [key: string]: Language } = {};

  addSchema(schema: ISchema): string {
    this.languages[schema.name] = new Language(schema);

    return schema.name;
  }

  highlight(code: string, schema: ISchema | string): string {
    const name = typeof schema === 'object' ? this.addSchema(schema) : schema;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const language = this.languages[name]!;
    const tokens = parse(code, language);

    return [
      `<pre><code class="${PREFIX}container">`,
      render(code, tokens, language, this.languages),
      '</code></pre>',
    ].join('');
  }
}

export default Library;
