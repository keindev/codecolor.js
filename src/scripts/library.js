/* @flow */

import Parser from './parser';
import type { Languages } from './parser';
import { Language, PREFIX } from './language';
import type { ISchema, LanguageName } from './language';
import { version } from '../../package.json';

type Version = string;

class Library {
    version: Version = version;
    languages: Languages = {};
    activeSchema: LanguageName;

    highlight(code: string, schemaName?: LanguageName): string {
        return [
            `<pre><code class="${PREFIX}container">`,
            Parser.parse(code, schemaName || this.activeSchema, this.languages),
            '</code></pre>',
        ].join('');
    }

    addSchema(schema: ISchema): string {
        this.languages[schema.name] = new Language(schema.name, schema);
        this.activeSchema = schema.name;

        return schema.name;
    }
}

export default new Library();
