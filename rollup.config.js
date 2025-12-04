import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const name = 'RojeruAlert';
const input = 'src/index.js';
const version = '1.0.4';

const banner = `/*!
 * RojeruAlert v${version}
 * https://github.com/rojerusan/rojeru-alert
 * (c) 2025 Rogelio Urieta Camacho (RojeruSan)
 * Released under the MIT License
  * MIT License
 *
 * Copyright (c) 2025 Rogelio Urieta Camacho (RojeruSan)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */`;

export default [
    // ===== VERSIÓN GLOBAL (Navegador) =====
    {
        input,
        output: {
            name,
            file: 'dist/rojeru-alert.global.js',
            format: 'iife',
            exports: 'named',
            globals: {},
            banner
        },
        plugins: [
            resolve(),
            commonjs(),
            css({ output: 'rojeru-alert.css' })
        ]
    },

    // ===== VERSIÓN GLOBAL MINIFICADA =====
    {
        input,
        output: {
            name,
            file: 'dist/rojeru-alert.global.min.js',
            format: 'iife',
            exports: 'named',
            globals: {},
            banner
        },
        plugins: [
            resolve(),
            commonjs(),
            css({ output: 'rojeru-alert.min.css' }),
            terser()
        ]
    },

    // ===== UMD (Universal) =====
    {
        input,
        output: {
            name,
            file: 'dist/rojeru-alert.umd.js',
            format: 'umd',
            exports: 'named',
            globals: {}
        },
        plugins: [
            resolve(),
            commonjs(),
            css({ output: false })
        ]
    },

    // ===== ES MODULE =====
    {
        input,
        output: {
            file: 'dist/rojeru-alert.esm.js',
            format: 'es',
            exports: 'named'
        },
        plugins: [
            resolve(),
            commonjs(),
            css({ output: 'rojeru-alert.css' })
        ]
    },

    // ===== COMMONJS =====
    {
        input,
        output: {
            file: 'dist/rojeru-alert.cjs.js',
            format: 'cjs',
            exports: 'named'
        },
        plugins: [
            resolve(),
            commonjs(),
            css({ output: false })
        ]
    }
];