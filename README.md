
# gulp插件 

## 1.官网
**npm packages：**
                https://www.npmjs.com/
                

                
## 2.常用的gulp插件

### 2.1自动加载
使用：**==gulp-load-plugins==**

文档：https://www.npmjs.com/package/gulp-load-plugins

安装： ```npm install --save-dev gulp-load-plugins```

用法：
```
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

```
后面就可以通过 plugins.name() 还获取插件对象；
相当于：
```
plugins.jshint = require('gulp-jshint');
plugins.concat = require('gulp-concat');

```
最后要提醒的一点是，因为 **gulp-load-plugins** 是通过你的 **package.json** 文件来加载插件的，所以必须要保证你需要自动加载的插件已经写入到了 **package.json** 文件里，并且这些插件都是已经安装好了的。

### 2.2重命名
使用：**==gulp-rename==**

文档：https://www.npmjs.com/package/gulp-rename

安装： ```npm install --save-dev gulp-rename```

用法：
```
gulp.src("./app/index.html")
        .pipe(plugins.rename(function (path) {
            path.dirname += "/rename/"; // 地址
            path.basename += "-goodbye"; // 文件名
            path.extname = ".md" // 文件后缀
        }))
        .pipe(gulp.dest("./dist"));

```

### 2.3压缩JS 变量 混淆
使用：**==gulp-uglify==**

文档：https://www.npmjs.com/package/gulp-uglify

安装： ```npm install --save-dev gulp-uglify```

用法：
```
    gulp.src('./app/js/*.js') // 要压缩的js文件
        .pipe(plugins.uglify({
            'mangle': true,//类型：Boolean 默认：true 是否修改变量名
            'compress': true,//类型：Boolean 默认：true 是否完全压缩
            'preserveComments': 'all' //保留所有注释
        }))  //使用uglify进行压缩,更多配置请参考：
        .pipe(gulp.dest('./dist/js')); //压缩后的路径

```

### 2.4 css压缩
使用：**==gulp-minify-css==**

文档：https://www.npmjs.com/package/gulp-minify-css

安装： ```npm install --save-dev gulp-minify-css```

用法：
```
    gulp.src('./app/css/*.css') // 要压缩的css文件
        .pipe(plugins.minifyCss()) //压缩css
        .pipe(gulp.dest('./dist/css'));

```

### 2.5 css自动补全浏览器的前缀
使用：**==gulp-autoprefixer==**

文档：https://www.npmjs.com/package/gulp-autoprefixer

安装： ```npm install --save-dev gulp-autoprefixer```

用法：
```
    gulp.src('./app/css/*')
            .pipe(plugins.autoprefixer({
                browsers: ['last 5 versions', 'Android >= 4.0'], // 每个主要浏览器最后5个版本，安卓 4.0以上
                cascade: false, //是否美化属性值 默认：true
                remove:true //是否去掉不必要的前缀 默认：true
            }))
            .pipe(gulp.dest('./dist/css'));
```

### 2.6文件合并
使用：**==gulp-concats==**

文档：https://github.com/contra/gulp-concat

安装： ```npm install --save-dev gulp-concats```

用法：
```
    gulp.src('./app/js/*.js')
        .pipe(plugins.concat('all.js')) //合并后文件名
        .pipe(gulp.dest('./dist/js'));
```

### 2.7自动刷新页面
使用：**==browsersync-ssi  browser-sync==**

文档：http://www.browsersync.cn/docs/options

安装： ```npm install --save-dev browsersync-ssi  browser-sync```

用法：
```
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
```