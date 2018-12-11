const path = require('path');
const fs = require('fs');
const util = require('util');
const pkg = require('../package.json');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const DIR = 'dist';
const FILE_EXTNAME = '.js';
const DELIMETER = `\n\n`;
const BANNER =
`/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 *
 * (c) 2018-${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License.
 */`;

(async function() {
    try {
        const fileNames = await readdir(DIR);

        for (const file of files) {
            const filePath = path.join(DIR, file);

            if (path.extname(filePath) === FILE_EXTNAME) {
                const data = await readFile(filePath);

                await writeFile(filePath, [BANNER, data.toString()].join(DELIMETER));
            }
        }
    } catch(err) {
        throw err;
    }
})();
