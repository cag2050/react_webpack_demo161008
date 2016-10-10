/**
 * Created by chenag on 2016/9/14.
 */
var fs = require("fs"),
    path = require("path"),
    jsPage = "/js/page/";
// 获得js/page文件夹下的js文件
var getJsFiles = function () {
    var jsPath = path.resolve("src" + jsPage);
    var dirs = fs.readdirSync(jsPath);
    var matchs = [],
        files = {},
        all = [];
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        var _path = '';
        if (matchs) {
            _path = path.resolve("src" + jsPage, item);
            files[matchs[1]] = _path;
            all.push(_path);
        }
    });
    return files;
};

var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");
var IgnorePlugin = require("webpack/lib/IgnorePlugin");
// 样式不被打包到脚本中，而是独立出来作为.css，然后在页面中以<link>标签引入
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    // 开发调试信息
    devtool: "source-map",
    // 页面入口文件
    entry: getJsFiles(),
    //entry:'./src/js/page/Person_use.js',
    // 打包后输出文件配置
    output: {
        path: path.join(__dirname, "build" + jsPage), //文件输出目录
        // publicPath: 'http://localhost:63342/webpack_self_demo160914/build/',
        filename: "[name].js",
        sourceMapFilename: "[file].map"
    },
    // 文件后缀名自动补全
    //resolve: {
    //    alias: {},
    //    extensions: ['', '.js', '.jsx']
    //},
    // 处理文件的加载器loader配置
    module: {
        loaders: [
            // 样式被打包到脚本中,scss文件同理
            // {test: /\.css$/, loader: 'style!css'},
            /* 样式不被打包到脚本中，而是独立出来作为.css，
             * 然后在页面中以<link>标签引入
             * scss文件同理
             */
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style", "css")
            },
            // {test: /\.scss$/, loader: "style!css!sass"},
            {
                test: /.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css', 'sass')
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url'
            },
            {
                //test: path.join(__dirname, 'js/page'),
                test: /\.js$/,
                // test: /\.js|jsx$/,
                exclude: "/node_modules/",
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.jsx$/,
                exclude: "/node_modules/",
                // 还未安装react-hot
                //    loaders: ['react-hot', 'babel'],
                loader: 'babel',
                query: {
                    presets: ['es2015','react']
                    // presets: ['es2015','react']
                }
            }
        ]
    },
    // 插件配置
    plugins: [
        //new IgnorePlugin(/jquery/),
        // 提取公共部分；若此处开启，html页面必须引入此公用js
        //new CommonsChunkPlugin({
        //    filename: "common.js",
        //    name: "common"
        //}),
        // 压缩js
        new UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        // 指定不被打包到脚本中、独立出来的css的文件名
        new ExtractTextPlugin("[name].css")
    ]
};

// console.log(config);
module.exports = config;