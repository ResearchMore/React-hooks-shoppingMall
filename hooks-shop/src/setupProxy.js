const proxy = require('http-proxy-middleware')
module.exports = function (app) {
    app.use(proxy('/api',
        {
            target: 'http://localhost:7002',
            pathRewrite: {
                "^/api": ""
            },
            changeOrigin: true,
        }))
    // app.use(proxy('/*.svg', { target: 'http://localhost:5000/' }))
}