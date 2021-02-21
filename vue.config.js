module.exports = {
    baseUrl: './',
    //输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    assetsDir: 'static',
    //以多页模式构建应用程序。
    pages: undefined,
    productionSourceMap: false,
    devServer: {
        port: 80,
    }
}