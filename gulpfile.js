/*!
 * gulp
 * $ npm install gulp-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),                //编译sass
    autoprefixer = require('gulp-autoprefixer'),//自动添加浏览器厂商前缀
    cleancss = require('gulp-clean-css'),      //压缩css
    spritesmith = require('gulp.spritesmith'),  //css雪碧图
    jshint = require('gulp-jshint'),            //检测js语法错误
    uglify = require('gulp-uglify'),            //压缩js
    imagemin = require('gulp-imagemin'),        //压缩img
    rename = require('gulp-rename'),            //重命名
    concat = require('gulp-concat'),            //代码合并
    notify = require('gulp-notify'),            //提醒某个任务是否完成
    cache = require('gulp-cache'),              //只压缩修改的图片，没有修改的图片直接从缓存文件读取
    contentIncluder = require('gulp-content-includer'), //include 公共html文件
    browserSync = require('browser-sync'),      //浏览器自动刷新
    reload = browserSync.create().reload;
   
 
// 编译sass、自动添加css前缀和压缩
gulp.task('styles', function() {
    return gulp.src('app/css/*.scss')
    .pipe(sass())
    //添加浏览器厂商前缀
    .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari 5','ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
    }))
   	//保存未压缩文件到我们指定的目录下
    //.pipe(gulp.dest('app/css'))
    //给文件添加 .min后缀
    .pipe(rename({ suffix: '.min' }))
    //压缩样式文件
    .pipe(cleancss())
    //输出压缩文件到指定目录
    .pipe(gulp.dest('app/css'))
    //浏览器变化并实时更新
    .pipe(reload({stream:true}))
    //提醒该任务完成
    .pipe(notify({ message: 'css任务完成' }));
});

// js代码校验、合并和压缩
gulp.task('scripts', function() {
  return gulp.src('app/js/common.js')
    //代码校验
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    //代码合并到一个js文件
    //.pipe(concat('all.js'))
    //给文件添加 .min后缀
    .pipe(rename({ suffix: '.min' }))
    //压缩脚本文件
    .pipe(uglify())
    //输出压缩文件到指定目录
    .pipe(gulp.dest('app/js'))
    //浏览器变化并实时更新
    .pipe(reload({stream:true}))
    //提醒该任务完成
    .pipe(notify({ message: 'js任务完成' }));
});





/*// 事件监听
gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('app/css/*.scss', ['styles']);
  // Watch .js files
  gulp.watch('app/js/*.js', ['scripts']);
  // Watch image files
  gulp.watch('app/images/*', ['images']);

});*/





// Images
gulp.task('images', function() {
  return gulp.src('app/images/*')
    .pipe(cache(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true })))
    .pipe(gulp.dest('app/images/lib'))
    .pipe(notify({ message: 'img 压缩完成' }));
});




//自动合图
gulp.task('sprite', function () {
   return gulp.src('app/images/*.png')//需要合并的图片地址
        .pipe(spritesmith({
            imgName: 'images/sprite.png',//保存合并后图片的地址
            cssName: 'css/sprite.css',//保存合并后对于css样式的地址
            padding:5,//合并时两个图片的间距
            //algorithm: 'binary-tree',//注释1
        }))
        .pipe(gulp.dest('app/'));
});




// 浏览器自动刷新
gulp.task('browser-sync',['styles','scripts'],function(){
	var files = [
		'app/*.html',
		'app/css/*.css',
		'app/images/*.png',
		'app/js/*.js'
	];
	browserSync.init(files,{
		server:{
			baseDir:'./app'
		}
	});


  gulp.watch('app/css/*.scss', ['styles']);
  gulp.watch('app/js/*.js', ['scripts']);
  gulp.watch(['app/*']).on('change',reload);
});



gulp.task('default',['browser-sync']);

