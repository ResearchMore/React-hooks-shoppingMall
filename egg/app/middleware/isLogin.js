module.exports = function (opt, app) {
    return async (ctx, next) => {
        const arr = ['/register', '/login', '/resetPassword', '/data', '/recommend', '/getCard', '/isCollection','/myOrder/orderNum']
        const token = ctx.header.authorization
        if (!token) {
            if (arr.includes(ctx.url) || ctx.url.includes('/goods/one') || ctx.url.includes('/classification')) {
                await next()    // 没有登录也能请求
            } else {
                beOverdue(ctx)
            }
        } else {
            try {
                let payload = await app.jwt.verify(token, app.config.secret)
                if (payload) {
                    ctx.userName = payload
                    await next()
                } else {
                    beOverdue(ctx)
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}

// jwt过期
beOverdue = (ctx) => {
    ctx.status = 401;
    ctx.userName = null
    ctx.body = {
        msg: '登录过期，请重新登录',
        code: '20001'
    }
}