// @flow

import Parser from './parser';
import Language from './language';
import type { ILanguageSchema, Languages, LanguageName } from './language';
import { version } from '../../package.json';

type Version = string;

class Library {
    version: Version = version;
    languages: Languages = {};
    activeSchema: LanguageName;

    highlight(code: string, schemaName?: LanguageName): string {
        return [
            '<pre><code class="cc-container">',
            Parser.parse(code, schemaName || this.activeSchema, this.languages),
            '</code></pre>',
        ].join('');
    }

    addSchema(schema: ILanguageSchema): string {
        this.languages[schema.name] = new Language(schema);
        this.activeSchema = schema.name;

        return schema.name;
    }
}

export default new Library();
