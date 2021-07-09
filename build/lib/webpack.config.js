const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const dirSrc = path.join(__dirname, '..', '..', 'src');
const dirDist = path.join(__dirname, '..', '..', 'dist');

module.exports = {
  mode: 'production',
  entry: path.join(dirSrc, 'lib', 'address-parse.js'),
  output: {
    path: dirDist,
    filename: 'zh-address-parse.min.js', //打包之后生成的文件名，可以随意写。
    library: 'ZhAddressParse', // 指定类库名,主要用于直接引用的方式(比如使用script 标签)
    libraryExport: 'default', // 对外暴露default属性，就可以直接调用default里的属性
    globalObject: 'this', // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的情况
    libraryTarget: 'umd', // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
  },
  module: {
    rules: [{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }],
  },
  plugins: [new CleanWebpackPlugin()],
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
};
