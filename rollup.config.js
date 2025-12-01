import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const name = 'RojeruAlert';
const input = 'src/index.js';
const version = '1.0.0';

const banner = `/*!
 * RojeruAlert v${version}
 * https://github.com/rojerusan/rojeru-alert
 * (c) 2024 Rogelio Urieta Camacho (RojeruSan)
 * Released under the MIT License
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