'use strict';
module.exports = appInfo => {

    const config = exports = {};
    config.keys = appInfo.name + '_1558097353711_257';
    config.middleware = [];
    const userConfig = {
    };
    config.middleware = ['isLogin'];
    exports.jwt = {
        secret: "egg" //自己设置的值
    }
    // 关闭默认的安全校验
    exports.security = {
        csrf: false
    }
    // 连接数据库
    exports.mongoose = {
        client: {
            url: 'mongodb://127.0.0.1/reactMall',
            options: {},
        },
    }
    return {
        ...config,
        ...userConfig,
    };
};
