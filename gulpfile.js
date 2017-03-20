var gulp = require('gulp');
//多浏览器多设备同步&自动刷新
var browserSync = require('browser-sync').create();
var SSI = require('browsersync-ssi');
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
gulp.task('minify-css', function(){
    gulp.src('./app/css/*.css') // 要压缩的css文件
        .pipe(plugins.minifyCss()) //压缩css
        .pipe(gulp.dest('./dist/css'));
});

//js代码检查
gulp.task('jshint', function(){
    gulp.src('./app/js/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter()); // 输出检查结果
});

// html文件压缩
gulp.task('minify-html', function(){
    gulp.src('./app/*.html') // 要压缩的html文件
        .pipe(plugins.minifyHtml()) //压缩
        .pipe(gulp.dest('./dist'));
});

// css自动补全浏览器的前缀
gulp.task('autoprefixer', function() {
        gulp.src('./app/css/*')
            .pipe(plugins.autoprefixer({
                browsers: ['last 5 versions', 'Android >= 4.0'], // 每个主要浏览器最后5个版本，安卓 4.0以上
                cascade: false, //是否美化属性值 默认：true
                remove:true //是否去掉不必要的前缀 默认：true
            }))
            .pipe(gulp.dest('./dist/css'));
});

//文件合并
gulp.task('concats', function(){
    gulp.src('./app/js/*.js')
        .pipe(plugins.concat('all.js')) //合并后文件名
        .pipe(gulp.dest('./dist/js'));
});

//图片压缩
gulp.task('gulp-concat', function(){});

//自动刷新
gulp.task('serve', function() {
    //使用browserSync创建服务器，自动打开浏览器并打开./dist文件夹中的文件（默认为index.html）
    browserSync.init({
        // UI 端口
        ui: {
            port: 8080
        },
        server: {
            baseDir:["./dist"], //根目录
            index: "index.html", //默认打开页面
            middleware:SSI({
                baseDir:'./dist',
                ext:'.shtml',
                version:'2.10.0'
            })
        }
    });
    //如果有任何文件变动，自动刷新浏览器
    gulp.watch("./dist/*.html").on("change",browserSync.reload);
});



