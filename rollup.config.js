import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import pkg from './package.json';

const file = pkg.name.toLowerCase().replace('.js', process.env.NODE_ENV == 'transpile-legacy' ? '.legacy' : '');
const entryPoint = 'codecolor';

export default {
    input: './src/scripts/library.js',
    output: {
        file: `./dist/${file}.js`,
        format: 'umd',
        name: entryPoint
    },
    plugins: [
        json({
            exclude: [ 'node_modules/**' ],
        }),
        babel({
            exclude: [ 'node_modules/**' ],
        })
    ]
};
