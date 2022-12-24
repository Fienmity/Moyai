import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import Manifest from './src/manifest.json';
import { defineConfig } from 'rollup';

export default defineConfig({
   input: 'src/index.tsx',
   output: [
      {
         file: `dist/${Manifest.name}.js`,
         format: 'cjs',
         strict: false
      },
   ],
   plugins: [
      nodeResolve(),
      commonjs(),
      json(),
      copy({ targets: [{ src: 'src/manifest.json', dest: 'dist/' }] }),
      esbuild({ minify: true, target: 'ES2019' }),
   ]
});
