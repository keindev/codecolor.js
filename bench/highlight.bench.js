/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
/* eslint-disable global-require, import/no-dynamic-require, import/no-unresolved */
const path = require('path');
const fs = require('fs');
const colors = require('colors');
const Benchmark = require('benchmark');
const prism = require('prismjs');
const prismLoadLanguage = require('prismjs/components/');
const hljs = require('highlight.js/lib/highlight');
const codecolor = require('./../dist/codecolor');

const DIR_TESTS = path.join(__dirname, 'tests');
const files = fs.readdirSync(DIR_TESTS);

console.log(colors.underline('Test perf:'));
files.forEach((file) => {
    const language = require(path.join(DIR_TESTS, file));
    const text = String(fs.readFileSync(path.join(__dirname, '../', language.filaPath)));
    const suite = new Benchmark.Suite();

    console.log(`- ${language.name}:`);

    prismLoadLanguage([language.name]);
    codecolor.addSchema(require(path.join(__dirname, '../dist/languages', `${language.name}.json`)));
    hljs.registerLanguage(language.name, require(`highlight.js/lib/languages/${language.name}`));

    suite.add(colors.green('CodeColor.js'), () => {
        codecolor.highlight(text);
    });

    suite.add(colors.green('Prism.js'), () => {
        prism.highlight(text, prism.languages[language.name], language.name);
    });

    suite.add(colors.green('highlight.js'), () => {
        hljs.highlight(language.name, text);
    });

    suite.on('cycle', (event) => {
        console.log(String(event.target));
    });

    suite.on('complete', (event) => {
        console.log(`# Fastest is ${colors.underline(event.currentTarget.filter('fastest').map('name').pop())}`);
    });

    suite.run(false);
});
