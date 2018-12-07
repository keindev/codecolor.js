import Language from '../../src/scripts/language';
import { LITERAL_NAMES, STATEMENT_NAMES } from '../../src/scripts/language';

const schema = {
    name: 'abstract',
    literals: [],
    statements: {}
};

describe('Check Language', () => {
    it('new Language: (Abstract)', () => {
        const language = new Language(schema);

        // TODO: create abstract lang
        // TODO: check literals & statements
    });
});
