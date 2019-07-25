const BaseController = require('../base')
const md5 = require('md5')
class UserController extends BaseController {
    async login() {
        // let userToken = '小白'
        // const token = await this.service.token.setToken(userToken)
        // // const aa = await this.app.jwt.verify(token, this.app.config.secret)
        // console.log(token);
        const { ctx } = this
        const { username, password, verify } = ctx.request.body
        if (!username || !password) {
            return this.error('请输入完整信息')
        }
        // if (this.ctx.session.code.toUpperCase() !== verify.toUpperCase()) {
        //     return ctx.body = {
        //         code: -2,
        //         msg: '验证码错误'
        //     }
        // }
        let data = await ctx.model.User.findOne({ username })
        if (!data || !data.username) {  //说明数据库没有这个名字
            this.error('用户名或邮箱错误')
        } else {
            if (data.password != md5(password)) {
                this.error('密码错误')
            } else {
                const token = await this.service.token.setToken(username)
                this.success('登录成功', token)
            }
        }
    }

    async register() {
        const { ctx } = this
        let { username, password, verify, email } = ctx.request.body
        if (!username || !password || !email) {
            return this.error('请输入完整信息')
        }
        // if (this.ctx.session.code.toUpperCase() !== verify.toUpperCase()) {
        //     return ctx.body = {
        //         code: -2,
        //         msg: '验证码错误'
        //     }
        // }
        let data = await ctx.model.User.findOne({ username })
        let data2 = await ctx.model.User.findOne({ email })
        if (!data && !data2) {
            password = md5(password)
            let user = await new ctx.model.User({ username, password, email })
            await user.save()
            // Token
            const token = await this.service.token.setToken(user.username)
            this.success('注册成功', token)
        } else {
            if (data && data.username === username) return this.error('用户名已存在')
            if (data2 && data2.email === email) return this.error('邮箱已存在')
        }
    }

    // 找回密码
    async resetPassword() {
        const { ctx } = this
        const { email, password } = ctx.request.body
        if (!email || !password) return this.error('请输入邮箱账号或密码')
        const user = await ctx.model.User.findOne({ email })
        if (user && email === user.email) {
            await ctx.model.User.updateOne({ _id: user._id }, {
                $set: {
                    email,
                    password: md5(password)
                }
            })
            this.success('修改成功')
        } else {
            this.error('该邮箱未注册！')
        }
    }

    // 查询购物车
    async getCard() {
        const { ctx } = this
        const res = await ctx.model.ShopList.find({ userName: this.ctx.userName }).sort({ 'add_time': -1 })
        if (res) {
            this.success('查询成功', res)
        } else {
            this.error('查询失败')
        }

    }

    // 查询商品是否已经收藏
    async isCollection() {
        const { ctx } = this
        const { id } = this.ctx.request.body    // 商品id
        const result = await ctx.model.Collection.findOne({ cid: id, userName: this.ctx.userName })
        if (!result) {  // 未收藏
            this.success('查询成功', { isCollection: 0 })
        } else {  // 已经收藏
            this.success('查询成功', { isCollection: 1 })
        }
    }

    // 查询收藏的商品
    async collectionList() {
        const { ctx } = this
        let pageSize = 10
        let page = ctx.query.page || 1
        let skip = (page - 1) * pageSize
        const list = await ctx.model.Collection.find({ userName: ctx.userName }).sort({ 'add_time': -1 }).skip(skip).limit(pageSize)
        const count = await ctx.model.Collection.find({ userName: ctx.userName }).countDocuments()
        this.success('查询成功', { count, list, page })

    }

    // 查询用户收货地址
    async getAddress() {
        const { ctx } = this
        const address = await ctx.model.Address.find({ userName: ctx.userName }) || []
        if (address.length) {
            let flag
            address.forEach(item => {
                if (item.isDefault == true) {
                    flag = item
                }
            })
            if (!flag) {
                await ctx.model.Address.updateOne({ userName: ctx.userName, _id: address[0]._id }, {
                    $set: {
                        'isDefault': true
                    }
                })
            }
        }

        this.success('查询成功', address)
    }

    // 设置默认收货地址        
    async setDefaultAddress() {
        const { ctx } = this
        const { id } = ctx.request.body
        await ctx.model.Address.updateMany({ userName: ctx.userName, isDefault: true }, {
            $set: {
                'isDefault': false,
            }
        })

        await ctx.model.Address.updateOne({ userName: ctx.userName, _id: id }, {
            $set: {
                'isDefault': true,
            }
        })
        this.success('设置默认地址成功')
    }

    // 查询默认收货地址
    async getDefaultAddress() {
        const { ctx } = this
        const defaultAdd = await ctx.model.Address.findOne({ userName: ctx.userName, isDefault: true })
        this.success('查询成功', defaultAdd)
    }

    // 查询用户单条订单
    async getOrderDetils() {
        const { ctx } = this
        const order_id = ctx.query.order_id
        const order = await ctx.model.OrderList.findOne({ userName: ctx.userName, order_id })
        this.success('查询成功', order)
    }

    // 查询用户订单
    async myOrder() {
        const { ctx } = this
        const { status } = ctx.query
        if (status != 0 && status != 1) {
            return this.success('查询成功', [])
        }

        let pageSize = 10
        let page = ctx.query.page || 1
        let skip = (page - 1) * pageSize

        const res = await ctx.model.OrderList.find({ userName: ctx.userName, status }).sort({ 'add_time': -1 }).skip(skip).limit(pageSize)
        const count = await ctx.model.OrderList.find({ userName: ctx.userName, status }).countDocuments()
        let data = {
            list: res,
            count
        }
        this.success('查询成功', data)
    }

    // 查询用户订单数量
    async orderNum() {
        const { ctx } = this
        // 0,待付款 1，已完成
        let num = [], num1 = [],numList = []
        const res = await ctx.model.OrderList.find({ userName: ctx.userName })
        res.forEach(item => {
            if (item.status == 0) {
                num.push(item)
            } else if (item.status == 1) {
                num1.push(item)
            }
        })
        numList.push(num.length, num1.length)
        this.success('查询成功', { numList })
    }
}


module.exports = UserController;