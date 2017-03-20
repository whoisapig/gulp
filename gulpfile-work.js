//使用严格模式的js。保证js的严谨，作为一个好习惯。
'use strict';

//使用require引入所有需要的模块，这是node.js语法，不了解的话记住就行了。
//gulp
var gulp        = require('gulp'),
    //多浏览器多设备同步&自动刷新
    browserSync = require('browser-sync').create(),
    SSI         = require('browsersync-ssi'),
    //整合文件
    concat      = require('gulp-concat'),
    //混淆js   暂时没用到
    uglify = require('gulp-uglify'),
    //压缩js
    minify      = require('gulp-minify'),
    //错误处理插件plumber
    plumber     = require('gulp-plumber'),
    //compass 用来编译sass
    compass     = require('gulp-compass'),
    //clean 用来删除文件
    clean       = require('gulp-clean'),
    //压缩文件
    zip         = require('gulp-zip');
//控制task中的串行和并行。这个很重要，它能够严格规定task的执行顺序，否则gulp默认并行，有些时候会产生问题。如先清空再重建文件，可能重建过程中又清空了。
    runSequence = require('gulp-run-sequence');
//上边引入模块之后，下面开始编写任务:

//创建一个名为serve的任务，该任务的内容就是匿名函数中的内容。
gulp.task('serve', function() {
    //使用browserSync创建服务器，自动打开浏览器并打开./dist文件夹中的文件（默认为index.html）
    browserSync.init({
        server: {
            baseDir:["./dist"],
            middleware:SSI({
                baseDir:'./dist',
                ext:'.shtml',
                version:'2.10.0'
            })
        }
    });
    //监听各个目录的文件，如果有变动则执行相应的任务操作文件
    gulp.watch("app/sass/**/*.scss", ['compass']);
    gulp.watch("app/javascript/**/*.js", ['js']);
    gulp.watch("app/**/*.html", ['html']);
    //如果有任何文件变动，自动刷新浏览器
    gulp.watch("dist/**/*.html").on("change",browserSync.reload);
});

//下面来分别看看处理各个部分的任务：

//compass任务，将scss编译为css
gulp.task('compass', function() {
    //首先取得app/sass下的所有后缀为.scss的文件（**/的意思是包含所有子文件夹）
    return gulp.src('app/sass/**/*.scss')
        .pipe(compass({
            //设置生成sourcemap，在调试器中显示样式在scss文件中的位置，便于调试
            sourcemap: 'true',
            //输出格式设置为compressed就不需要压缩css了
            style: 'compressed',
            //文件目录
            css: 'dist/stylesheets',
            sass: 'app/sass',
            image: 'app/images'
        }))
        //如果有错误输出错误提示
        .on('error', function(error) {
            // Would like to catch the error here
            console.log(error);
            this.emit('end');
        })
        //编译后的文件放入dist/stylesheets下
        .pipe(gulp.dest('dist/stylesheets'))
        //自动刷新浏览器
        .pipe(browserSync.stream());
});


//js任务，将js压缩后放入dist。该任务要在clean-scripts任务完成后再执行
gulp.task('js', function(){
    //首先取得app/javascript下的所有后缀为.js的文件（**/的意思是包含所有子文件夹）
    return gulp.src('app/javascript/**/*.js')
    //错误管理模块
        .pipe(plumber())
        //目前没用混淆，不方便调试
        //.pipe(uglify())
        //js压缩
        .pipe(minify())
        //输出到dist/javascript
        .pipe(gulp.dest("dist/javascript"))
        //自动刷新浏览器
        .pipe(browserSync.stream());
});



//html任务，目前什么都没做。只是单纯的把所有html从开发环境app复制到测试环境dist
gulp.task('html', function() {
    return gulp.src("app/*.html")
        .pipe(plumber())
        .pipe(gulp.dest("dist/"))
        .pipe(browserSync.stream());
});

//publish任务，需要的时候手动执行，将dist中的文件打包压缩放到release中。
gulp.task('publish', function(){
    //取得dist文件夹中的所有文件
    return gulp.src('dist/**/*')
    //错误处理模块
        .pipe(plumber())
        //压缩成名为publish.zip的文件
        .pipe(zip('publish.zip'))
        //放入release文件夹
        .pipe(gulp.dest('release'))
});
//clean任务：清空dist文件夹，下边重建dist的时候使用
gulp.task('clean', function () {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});

//redist任务：需要时手动执行，重建dist文件夹：首先清空，然后重新处理所有文件
gulp.task('redist',function(){
    //先运行clean，然后并行运行html,js,compass
    runSequence('clean',['html','js','compass']);
});
//建立一个名为default的默认任务。当你在gitbash中执行gulp命令的时候，就会
gulp.task('default', function(){
    //先运行redist，启动服务器
    runSequence('redist','serve');
});