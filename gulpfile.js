// 引用gulp模块
const {
	src,
	dest,
	series,
	watch
} = require('gulp');

// 引入html公共文件抽离
const fileinclude = require('gulp-file-include');

// 引入html压缩及配置压缩项
const htmlmin = require('gulp-htmlmin');
const htmlminOptions = {
	removeComments: true, //清除HTML注释
	collapseWhitespace: true, //压缩HTML 删除空格 并压缩成一行
	collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
	removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
	removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
	removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
}

// 引入sass编译 及 css压缩 及自动添加样式熟悉前缀
const sass = require('gulp-sass')
const minifycss = require('gulp-minify-css')
const autoprefixer = require('gulp-autoprefixer');

// 引入实时刷新
const connect = require('gulp-connect');
const open = require('open')
// 引入文件重命名
const rename = require('gulp-rename')

// 引入js压缩 混淆
const uglify = require('gulp-uglify');
const javascriptObfuscator = require('gulp-javascript-obfuscator');

// 引入es6转化es5
const babel = require('gulp-babel');


// 引入图片资源压缩
const tiny = require('gulp-tinypng-nokey');

// 创建压缩图片相关的业务  由于压缩耗时过久 最后上线前压缩即可
function aboutImg(cb) {
	src(['./src/**/imgs/*', './src/**/**/**/imgs/*'])
		.pipe(tiny())
		.pipe(dest('./dist'))
	cb();
}


// 浏览器实时刷新

function server(cb) {
	connect.server({
		root: 'dist',
		port: 8000,
		livereload: true
	});
	open('http://localhost:8000');
	watch('./src/index.html', aboutHtml)
	watch('./src/**/**/index.html', aboutHtml)
	watch('./src/common/html/**/index.html', aboutHtml)
	watch('./src/**/**/style.scss', aboutCss)
	watch('./src/**/**/**/**/style.scss', aboutCss)
	watch('./src/common/scss/**/*.scss', aboutCss)
	watch('./src/**/**/*.js', aboutJs)
	watch('./src/**/**/**/**/*.js', aboutJs)
	watch('./src/common/**/*.js', aboutJs)
}


// 创建html相关的打包任务
function aboutHtml(cb) {
	src(['./src/index.html', './src/**/**/index.html', '!./src/common/html/**/index.html'])
		.pipe(fileinclude())
		.pipe(htmlmin(htmlminOptions))
		.pipe(dest('./dist'))
		.pipe(connect.reload())
	cb();
}


// 创建关于css的打包任务 包括scss转化 css压缩
// 打包页面相关的css
function aboutCss(cb) {
	src(['./src/**/**/style.scss', './src/**/**/**/**/style.scss', '!./src/common/scss/**/*.scss'])
		.pipe(sass())
		.pipe(autoprefixer({}))
		.pipe(minifycss())
		.pipe(rename({
			suffix: '.min' //rename只是给上一步骤产出的压缩的styles.css重命名为style.min.css
		}))
		.pipe(dest('./dist'))
		.pipe(connect.reload())
	cb();
}

// 拷贝文件 一般指的是common文件夹下的lib文件夹 一般指的是插件类型
function copyLib(cb) {
	src(['./src/common/lib/**/*.css', './src/common/lib/**/*.js'])
		.pipe(dest('./dist/common/lib'))
	cb();
}

// 拷贝common文件夹下的css文件 如reset.css  animate.css
function copyCSS(cb) {
	src('./src/common/css/*.css')
		.pipe(dest('./dist/common/css'))
	cb();
}

// 拷贝common文件夹下的imgs文件 公共图片
function copyImgs(cb) {
	src('./src/common/imgs/*')
		.pipe(dest('./dist/common/imgs'))
	cb();
}

// 开发环境不压缩图片 
function devAboutImg(cb) {
	src(['./src/**/imgs/*', './src/**/**/**/imgs/*'])
		.pipe(dest('./dist'))
	cb();
}


// 压缩每个页面的js文件
function aboutJs(cb) {
	src(['./src/**/**/*.js', './src/**/**/**/**/*.js', './src/common/**/*.js'])
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify({
			mangle: true
		}))
		.pipe(javascriptObfuscator())
		.pipe(dest('./dist'))
		.pipe(connect.reload())
	cb();
}

exports.dev = series(devAboutImg, aboutHtml, aboutCss, copyImgs, copyLib, copyCSS, aboutJs, server);
exports.build = series(aboutHtml, aboutCss, copyImgs, copyLib, copyCSS, aboutJs, aboutImg);