const BaseController = require('../base')
class operatingGoods extends BaseController {
    // 加入购物车
    async addShop() {
        const { id } = this.ctx.request.body
        const { ctx } = this
        if (!id) {
            return this.error('缺少重要参数id')
        }
        const user = await ctx.model.User.findOne({ username: ctx.userName })
        const goodsData = await ctx.model.ShopList.findOne({ cid: id, uid: user._id })

        // 购物车已经有了这条商品，商品默认+1
        if (goodsData && user) {
            await ctx.model.ShopList.updateOne({ cid: id, uid: user._id }, {
                $set: {
                    count: goodsData.count += 1
                }
            })
        } else {  // 说明没有这条数据
            // 查到这条商品数据
            let goods = await ctx.model.Goods.findOne({ id: id })
            let newGoods = new ctx.model.ShopList({
                uid: user._id,
                userName: ctx.userName,
                present_price: goods.present_price,
                cid: goods.id,
                image_path: goods.image_path,
                name: goods.name,
                mallPrice: goods.present_price,
                check: false,
                count: 1,
                add_time: +new Date()
            })
            await newGoods.save()
        }
        this.success('加入购物车成功')
    }

    // 购物车增加减少
    async editCart() {
        const data = this.ctx.request.body
        const { ctx } = this
        if (!data) {
            return this.error('缺少重要参数')
        }
        await ctx.model.ShopList.updateOne({ userName: this.ctx.userName, cid: data.id }, {
            $set: {
                'count': data.count,
                'mallPrice': data.mallPrice,
            }
        })
        this.success('修改成功')
    }

    // 购物车删除
    async deleteShop() {
        const data = this.ctx.request.body
        if (!data.length) {
            return this.error('缺少重要参数')
        }
        const { ctx } = this
        await ctx.model.ShopList.deleteMany({ userName: this.ctx.userName, cid: data })
        this.success('删除成功')
    }

    // 收藏商品
    async collection() {
        const { id } = this.ctx.request.body
        if (!id) {
            return this.error('缺少重要参数id')

        }
        let goods = await this.ctx.model.Goods.findOne({ id })
        let collection = new this.ctx.model.Collection({
            userName: this.ctx.userName,
            cid: goods.id,
            image_path: goods.image_path,
            name: goods.name,
            present_price: goods.present_price,
            add_time: +new Date()
        })
        await collection.save()
        this.success('收藏成功')
    }

    // 取消收藏
    async cancelCollection() {
        const { id } = this.ctx.request.body
        if (!id) {
            return this.error('缺少重要参数id')
        }
        await this.ctx.model.Collection.deleteOne({ userName: this.ctx.userName, cid: id })
        this.success('取消收藏成功')
    }


    // 保存收货地址
    async address() {
        const { ctx } = this
        const data = ctx.request.body
        if (!data) {
            this.error('缺少重要参数')
            return
        }
        if (data.isDefault == true) {   // 设置默认地址
            await ctx.model.Address.updateMany({ userName: ctx.userName, isDefault: true }, {
                $set: {
                    'isDefault': false,
                }
            })
        }

        if (data.id) {    // 说明是更新地址
            await ctx.model.Address.updateOne({ _id: data.id, userName: ctx.userName }, data)
            const address = await ctx.model.Address.find({ userName: ctx.userName })
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
            this.success('修改成功')

        } else {  // 新增地址
            const datas = Object.assign(data, {
                userName: ctx.userName,
                add_time: +new Date()
            })
            const address = new ctx.model.Address(datas)
            await address.save()
            // 保存后查询一次
            const addressDef = await ctx.model.Address.find({ userName: ctx.userName })
            if (addressDef.length == 1) { // 如果数据库只有1条，设置这一条为默认地址
                if (!addressDef[0].isDefault) {
                    await ctx.model.Address.updateOne({ userName: ctx.userName, _id: addressDef[0]._id }, {
                        $set: {
                            'isDefault': true
                        }
                    })
                }
            }
            this.success('添加成功')
        }
    }

    // 删除单条收货地址
    async deleteAddress() {
        const { ctx } = this
        const { id } = ctx.request.body
        if (!id) {
            this.error('缺少重要参数id')
            return
        }
        // 查询到这条地址
        const address = await this.ctx.model.Address.findOne({ '_id': id })
        if (address.isDefault) {    // 如果删除的是默认地址
            const addressArr = await ctx.model.Address.find({ userName: ctx.userName })
            // 设置第一条为默认地址
            await ctx.model.Address.updateOne({ userName: ctx.userName, _id: addressArr[0]._id }, {
                $set: {
                    'isDefault': true
                }
            })
        }
        await this.ctx.model.Address.deleteOne({ '_id': id, userName: ctx.userName })
        this.success('删除成功')
    }

    // 查询单条收货地址
    async getOneAddress() {
        const { ctx } = this
        const { id } = ctx.request.body
        if (!id) {
            this.error('缺少重要参数id')
            return
        }
        const data = await this.ctx.model.Address.findOne({ '_id': id })
        this.success('查询成功', data)
    }

    // 接受订单
    async order() {
        const data = this.ctx.request.body
        const { ctx } = this
        if (!data) {
            return this.error('缺少重要参数')
        }

        // 根据地址id查询出收货地址
        const address = await ctx.model.Address.findOne({ _id: data.addressId })
        if (!address) {
            return this.error('缺少地址')
        }

        // 订单信息
        let platform = '622'           // 订单头
        let r1 = Math.floor(Math.random() * 10)
        let r2 = Math.floor(Math.random() * 10)
        let sysDate = ctx.helper.format(new Date(), 'YYYYMMDDHHmmss')          // 系统时间
        let add_time = ctx.helper.format(new Date(), 'YYYY-MM-DD HH:mm:ss')   // 订单创建时间
        let order_id = platform + r1 + sysDate + r2;   // 订单id
        // 根据id查询出购物车订单
        const order_list = await ctx.model.ShopList.find({ cid: { $in: data.goodsIds } })
        if (data.idDirect) {

        } else {

        }

        // 计算商品的总价（后端计算）
        let mallPrice = order_list.reduce((x, y) => {
            return x + y.present_price * y.count;
        }, 0)
        let orders = {
            userName: ctx.userName,
            status: 0,  // 未支付
            order_id,
            tel: address.tel,
            name: address.name,
            address: address.area + address.addressDetail,
            add_time,
            mallPrice: mallPrice.toFixed(2),
            order_list
        }
        // 存入数据库
        let orderList = new ctx.model.OrderList(orders)
        await orderList.save()
        // 删除购物车列表的商品
        if (!data.idDirect) {
            await ctx.model.ShopList.deleteMany({ userName: ctx.userName, cid: data.goodsIds })
        }

        this.success(`提交成功`, order_id)
        // return
        // for (let i = 0; i < data.goodsIds.length; i++) {
        //     if (data.idDirect) {    // 说明不是从购物车过来（直接购买）
        //         const res = await ctx.model.Goods.findOne({ id: data.goodsIds[0] })
        //         shopList[i] = {
        //             count: data.count,
        //             present_price: res.present_price,
        //             cid: res.id,
        //             image_path: res.image_path,
        //             name: res.name,
        //             mallPrice: data.count * res.present_price,
        //             userName: ctx.userName,
        //             order_id
        //         }
        //     } else {    // 购物车来的
        //         let item = await ctx.model.ShopList.find({ userName: ctx.userName, cid: data.goodsIds[i] })
        //         let datas = item[0]

        //         shopList[i] = {
        //             count: datas.count,
        //             present_price: datas.present_price,
        //             cid: datas.cid,
        //             image_path: datas.image_path,
        //             name: datas.name,
        //             mallPrice: datas.count * datas.present_price,
        //             userName: ctx.userName,
        //             order_id
        //         }
        //     }
        // }
        // // 计算商品的总价（后端计算）
        // const mallPrice = shopList.reduce((x, y) => {
        //     return x + y.present_price * y.count;
        // }, 0)
        // let orders = {
        //     userName: ctx.userName,
        //     status: 0,
        //     order_id,
        //     tel: data.tel,
        //     address: data.address,
        //     add_time,
        //     mallPrice,
        //     order_list: shopList
        // }
        // // 存入数据库
        // let orderList = new ctx.model.OrderList(orders)
        // await orderList.save()
        // // 删除购物车列表的商品
        // if (!data.idDirect) {
        //     await ctx.model.ShopList.deleteMany({ userName: ctx.userName, cid: data.orderId })
        // }
        // this.success(`结算成功,一共 ${mallPrice.toFixed(2)} 元`)
    }

    // 支付订单
    async payOrder() {
        const { ctx } = this
        if (!ctx.request.body.order_id) {
            return this.error('缺少参数id')
        }
        await ctx.model.OrderList.updateOne({ userName: ctx.userName, order_id: ctx.request.body.order_id }, { status: 1, add_time: ctx.helper.format(new Date(), 'YYYY-MM-DD HH:mm:ss') })
        this.success('支付成功')
    }
}

module.exports = operatingGoods;