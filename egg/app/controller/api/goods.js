const BaseController = require('../base')
class GoodsController extends BaseController {
    // 首页商品查询
    async recommend() {
        const { ctx } = this
        const res = await ctx.model.Recommend.findOne({})
        if (res) {
            return this.success('操作成功', res)
        }
        this.error('查询失败')
    }

    // 分类商品查询
    async classification() {
        const { ctx } = this
        const { mallSubId } = ctx.query
        if (!mallSubId) {
            this.error('缺少参数mallSubId')
            return
        }
        const res = await ctx.model.Goods.find({ 'sub_id': mallSubId })
        if (res) {
            return this.success('操作成功', res)
        }
        this.error('查询失败')
    }

    // 单个商品详情查询
    async goodsOne() {
        const { ctx } = this
        const { id } = ctx.query
        if (!id) {
            return this.error('缺少参数id')
        }
        let pageSize = 5
        let page = ctx.query.page || 1
        let skip = (page - 1) * pageSize
        if (page == 1) {
            var goods = await ctx.model.Goods.findOne({ id })
        }
        // const comment = await ctx.model.Comment.aggregate([
        //     {
        //         $lookup: {
        //             from: "user",
        //             localField: "comment_uid",
        //             foreignField: "_id",
        //             as: "user"
        //         }
        //     },
        //     {
        //         $match: {
        //             "cid": id
        //         },
        //     },
        //     {
        //         $skip: skip
        //     },
        //     {
        //         $limit: pageSize
        //     }
        // ])
        // const count = await ctx.model.Comment.find({ cid: id }).countDocuments()
        // if (comment.length) {
        //     comment.forEach(item => {
        //         if (item.anonymous) {
        //             item.comment_nickname = '匿名人士'
        //             delete item.comment_uid
        //             delete item.user
        //             item.comment_avatar = 'http://img4.imgtn.bdimg.com/it/u=198369807,133263955&fm=27&gp=0.jpg'
        //         }
        //     })
        // }

        if (goods) {
            this.success('操作成功', { goodsOne: goods })
            // ctx.body = {
            //     code: 200,
            //     goods: {
            //         goodsOne: goods,
            //         // comment,
            //         // count
            //     }
            // }
        } else {
            ctx.body = {
                code: 200,
                goods: {
                    // comment,
                    // count
                }
            }
        }

    }
}

module.exports = GoodsController;