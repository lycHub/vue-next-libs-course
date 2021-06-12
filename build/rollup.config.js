import { join } from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs' // commonjs转es6, 前端代码不需要
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import css from 'rollup-plugin-css-only'
import scss from 'rollup-plugin-scss'
import babel from '@rollup/plugin-babel';
import vue from 'rollup-plugin-vue';
import del from 'rollup-plugin-delete';


const baseOutput = format => ({
  format,
  file: `lib/${format}/index.js`
});

export default ({ format }) => {
  const output = format === 'esm' ? baseOutput(format) : {
    ...baseOutput(format),
    name: 'vue-next-libs',
    exports: 'named',
    globals: {
      vue: 'Vue'
    }
  }
  return {
    input: join(__dirname, '..', 'src/components/index.ts'),
    output,
    plugins: [
      del({ targets: 'lib/' + format }),
      terser(),
      nodeResolve(),
      scss({
        exclude: ['node_modules'],
        outputStyle: 'compressed',
        prefix: `@import "src/assets/styles/variable.scss";`,
      }),
      css(),
      vue({
        target: 'browser',
        css: false,
        exposeFilename: false
      }),
      typescript(),
      babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        babelHelpers: 'runtime'
      })
    ],
    external(id) {
      return /^vue/.test(id);
    },
  }
}
