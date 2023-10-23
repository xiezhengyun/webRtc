const fs = require('fs');

// 基础路径 注意发布之前要先修改这里
let baseUrl = './';
module.exports = {
    // baseUrl: baseUrl, // 根据你的实际情况更改这里
    // lintOnSave: true,
    // outputDir: '../public', // 默认 dist 打包文件输出位置
    // assetsDir: 'static', // 打包的 js、css、font 等存放的文件夹路径 相对于 outputDir，默认 ''，直接放在 outputDir里
    // // indexPath: '../public/index.html', // index.html 输出路径 默认 index.html
    // pages: {
    //     index: {
    //         entry: 'src/main.js',
    //         template: 'index1.html',
    //         filename: '../public/index.html',
    //         title: '首页',
    //     }
    // },
    devServer: {
        // publicPath: baseUrl, // 和 baseUrl 保持一致
        proxy: {
            'https://192.168.21.79:3002': {
                ws: false, // websocket 不需要代理
                target: 'http://192.168.21.79:3002',
                changeOrigin: true
            }
        },
        // port: '3221',
        https: {
            key: fs.readFileSync('./private.key'),
            // ca: [fs.readFileSync('./ca-cert.pem')],
            cert: fs.readFileSync('./mydomain.crt')
        }
    },
    
};
