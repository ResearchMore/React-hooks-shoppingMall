import * as types from './types'
import Api from 'api/api'
import { toast } from 'js/utils'
import { recentlyBrowse } from 'js/cache'

const _getGoodsDetails = data => ({
    type: types.GOODS_DETAILS,
    data
})


// 获取单个商品列表
export const getGoodsDetails = (id, page = 1) => {
    return async dispatch => {
        dispatch(_getGoodsDetails({}))
        try {
            const data = await Api.goodsDetails({ id, page })
            if (data.code === window.SUCCESS) {
                dispatch(_getGoodsDetails(data.data))
                recentlyBrowse.setBrowse(data.data.goodsOne)
            }
        } catch (error) {

        }
    }
}

// 查询是否收藏
export const isCollection = (id, setIsCollection) => {
    return async dispatch => {
        const data = await Api.isCollection({ id })
        if (data.code === window.SUCCESS) {
            setIsCollection(data.data.isCollection)
        }
    }
}

// 点击收藏

export const collection = (id, isCollection, setIsCollection) => {
    return async dispatch => {
        if (isCollection === Number(0)) { // 未收藏
            const data = await Api.collection({ id })
            if (data.code === window.SUCCESS) {
                toast('收藏成功')

                setIsCollection(1)
            }
        } else {    //取消收藏
            const data = await Api.cancelCollection({ id })
            if (data.code === window.SUCCESS) {
                toast('取消收藏成功')
                setIsCollection(0)
            }
        }

    }
}