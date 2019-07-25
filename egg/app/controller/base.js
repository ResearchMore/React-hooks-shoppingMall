// 父类
'use strict';
// 10002 其他错误
// 20001 token错误或者过期
const Controller = require('egg').Controller;
class BaseController extends Controller {
    async success(msg, data = null) {
        this.ctx.body = {
            code: 10000,
            msg,
            data
        }
    }

    async error(msg, code = 10002) {
        this.ctx.body = {
            code,
            msg
        }
    }

    async verify() {
        let captcha = await this.service.tools.captcha();  //服务里面的方法
        this.ctx.response.type = 'image/svg+xml';   /*指定返回的类型*/
        this.ctx.body = captcha.data;      /*给页面返回一张图片*/
    }

    async home() {
        await this.ctx.render('index')
    }
}

module.exports = BaseController;
