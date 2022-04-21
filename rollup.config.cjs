const relativePath = require('node:path').relative;
const json = require('@rollup/plugin-json');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const { terser } = require('rollup-plugin-terser');

const isDev = process.env.NODE_ENV === 'dev' ? true : false;
const isProd = process.env.NODE_ENV === 'prod' ? true : false;

const inputPath = relativePath(module.path, './src/extension.js');
const outputPath = relativePath(module.path, './dist/extension.js');

const config = {
  input: inputPath,
  output: {
    file: outputPath,
    format: 'cjs',
    sourcemap: isDev,
  },
  external: [
    'vscode',
    'fs',
    'path',
    'util',
    'module',
    'assert',
    'tty',
    'crypto',
    'os',
  ],
};

const plugins = [
  nodeResolve({
    extensions: ['.js', '.mjs'],
  }),
  commonjs({
    sourceMap: isDev,
    dynamicRequireTargets: [
      'node_modules/glob/{glob,sync}.js',
    ],
  }),
  json(),
  replace({
    preventAssignment: true,
    exclude: 'node_modules/**',
    'function commonjsRequire': 'function commonJsRequire',
    commonjsRequire: 'require',
  }),
];

if (isProd)
  plugins.push(terser());

module.exports = {
  ...config,
  plugins,
};
