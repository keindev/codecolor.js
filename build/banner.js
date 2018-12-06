const path = require('path');
const fs = require('fs');
const util = require('util');
const pkg = require('../package.json');
const dir = 'dist';
const banner =
`/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 *
 * (c) 2018-${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License.
 */`;

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function appendBanner() {
    try {
        const files = await readdir(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);

            if (path.extname(filePath) === '.js') {
                const data = await readFile(filePath);

                await writeFile(filePath, [banner, data.toString()].join(`\n\n`));
            }
        }
    } catch(err) {
        throw err;
    }
}

appendBanner();
