import Language, { ISchema, LanguageName, PREFIX } from './Language';
import Parser, { Languages } from './Parser';

class Library {
  languages: Languages = {};

  addSchema(schema: ISchema): void {
    this.languages[schema.name] = new Language(schema);
  }

  highlight(code: string, schema: LanguageName): string {
    return [`<pre><code class="${PREFIX}container">`, Parser.parse(code, schema, this.languages), '</code></pre>'].join(
      ''
    );
  }
}

export default Library;
