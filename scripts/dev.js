const args = require("minimist")(process.argv.slice(2))

const { resolve } = require("path"); // node 中内置的模块
const { build } = require("esbuild");


const target = args._[0] || 'reactivity';
const format = args.f || 'global';



// 开发环境只打包某一个
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

// iife 立即执行函数  (function(){})()
// cjs node中的模块   module.exports
// esm 浏览器中的esModule模块   import
const outputFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm';

// 输出文件
const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`);

// 天生就支持ts
build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)], // 入口点
  outfile,  // 输出文件
  bundle: true, //把所有包全部打包到一起
  sourcemap: true,  // 
  format: outputFormat, //输出格式
  globalName: pkg.buildOptions?.name,// 打包的全局的名字
  platform: format === 'cjs' ? 'node' : 'browser',  // 平台
  watch: {  // 监控文件变化
    onRebuild (error) {
      if (!error) console.log('rebuild....');
    }
  },
}).then(()=>{console.log("wacthing...")})