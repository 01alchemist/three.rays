const path = require('path');
const CommonConfig = require('../renderer-common/webpack.config')

const rootDir = path.resolve(__dirname, '../../');
const outDir = path.resolve(rootDir, 'dist');
const pkgDir = __dirname;

module.exports = {
    ...CommonConfig(rootDir, outDir, pkgDir),
    target: 'web',
};
