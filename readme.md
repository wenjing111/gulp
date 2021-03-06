# 基于 gulp 搭建的适用 pc 端及响应式及移动端页面的打包 demo

## 本文件模板能够实现的功能

- html 公共代码抽离 html 压缩
- scss 编译 css 压缩
- js 的 es6 转 es5(不包括 export 与 import) js 代码压缩 js 混淆
- 图片打包时的压缩处理
- 浏览器实时刷新

## 环境

- node
  - node 安装: [node 官网](https://nodejs.org/en/)下载即可,下载 LTS 文档版本,傻瓜式 next 安装
- gulp 及 gulp-cli
  - gulp-cli 需进行全局安装(一般工具进行全局安装,库文件进行当前项目安装)
    1. 安装命令: npm install -g gulp-cli(安装后会为我们提供一个 gulp 命令,在本文件中需要使用到)
- gulp 第三方插件
  - 在本文件中,使用到的第三方插件见 package.json 文件

## 文件目录结构

+ dist (打包后存放代码的文件夹)
+ node_modules(存放依赖的文件夹)
+ src (开发目录)
  - common (公共文件目录)
    * css (主要为引入的 css 文件,如 reset.css,animate.css,使用时在页面以 link 标签引入,在打包时并没有进行特殊处理,因此按照开发目录下的相对路径即可)
    * html (抽离的公共 html 文件,本文件示例抽离了 header 与 footer,并解决了 header 当前选中样式,及 a 标签跳转路径问题,header 如有图片,公共imgs文件夹下即可)
    * js (抽离的公共 js 文件,使用时以 script 标签引入,在打包时并没有进行特殊处理,因此按照开发目录下的相对路径即可)
    * lib (第三方依赖文件夹,无特殊处理)
      - swiper 文件夹(lib 下的依赖需要建立文件夹保存)
    * scss (scss 文件夹,主要为 html 抽离部分的 scss 样式,使用时,在需要引入的界面以`@import '路径'`引入即可)
    * imgs (公共图片存放,只在线上环境做了压缩处理)
  - pages (存放除首页的其他目录)
    * news (新闻页面)
      - static (静态文件存放)
      - index.html
  - static (首页的静态文件存放)
    * css (首页的scss文件)
    * imgs (首页图片)
    * js (首页js文件)
  - index.html (首页入口文件)
+ package.json  (记录文件)
+ gulpfile.js  (任务构建文件,**核心**)


## 使用步骤

- 在文件夹根目录打开黑窗口
- npm install 安装依赖
- 按照目录结构要求进行开发

## 开发环境浏览器调试及实时刷新

- 安装gulp-cli后在命令行工具执行,`gulp dev`,根据提示,在浏览器输入localhost:8000 即可

## 线上环境

- 线上环境包含图片压缩等操作,需要进行**联网**
- 命令: `gulp build`
- 线上环境打包时间过长,在未完成代码前,不建议使用线上环境打包

## 注意点

- 在引入公共html的scss样式时,请使用`@import '路径'`

- 目录结构必须按照实例,否则可能会无法达到效果

- 抽离header涉及路径跳转,选中样式等操作,建议仔细查看示例代码