var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

//重命名
gulp.task('rename', function (){
    gulp.src("./app/index.html")
        .pipe(plugins.rename(function (path) {
            path.dirname += "/rename/"; // 地址
            path.basename += "-goodbye"; // 文件名
            path.extname = ".md" // 文件后缀
        }))
        .pipe(gulp.dest("./dist"));
});

//js文件的压缩
gulp.task('minify-js', function () {
    gulp.src('./app/js/*.js') // 要压缩的js文件
        .pipe(plugins.uglify({
            "preserveComments" : "all" // 不留注释
        }))  //使用uglify进行压缩,更多配置请参考：
        .pipe(gulp.dest('./dist/js')); //压缩后的路径
});

//css文件压缩
gulp.task('minify-css', function(){});

//js代码检查
gulp.task('jshint', function(){
    gulp.src('./app/js/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter()); // 输出检查结果
});

//文件合并
gulp.task('gulp-concat', function(){});

//图片压缩
gulp.task('gulp-concat', function(){});

//自动刷新
gulp.task('gulp-concat', function(){});