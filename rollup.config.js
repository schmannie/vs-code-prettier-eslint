import pkg from './package.json';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const isDev = process.env.NODE_ENV === 'dev' ? true : false;
const isProd = process.env.NODE_ENV === 'prod' ? true : false;

const config = {
  input: './src/extension.js',
  output: {
    file: pkg.main,
    format: 'cjs',
    sourcemap: isDev,
  },
  external: [
    'assert',
    'fs',
    'module',
    'path',
    'util',
    'vscode',
  ],
};

const plugins = [
  json(),
  resolve({ preferBuiltins: true }),
  commonjs(),
  replace({
    preventAssignment: true,
    exclude: 'node_modules/**',
    'function commonjsRequire': 'function commonJsRequire',
    commonjsRequire: 'require',
  }),
];

if (isProd)
  plugins.push(terser());

export default {
  ...config,
  plugins,
};
