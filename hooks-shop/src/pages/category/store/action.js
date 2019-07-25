import * as types from './types'
import Api from 'api/api'
const _category = data => ({
    type: types.CATEGORY_TABS,
    data
})

const _categoryGoodsItem = data => ({
    type: types.CATEGORY_GOODS_ITEM,
    data
})


// 获取tab栏
export const getCategory = (setList,index,id = null,getEle) => {
    return async dispatch => {
        // 每次点击之前先清空
        dispatch({
            type: types.CATEGORY_GOODS_CLEAR,
        })
        // 然后再请求数据
        const data = await Api.recommend()
        if (data.code === window.SUCCESS) {
            dispatch(_category(data.data.category))
            setList(data.data.category[index].bxMallSubDto)
            if (index) {
                getEle(data.data.category[index].bxMallSubDto.length)
            }
            const defaultId = data.data.category[0].bxMallSubDto[0].mallSubId
            // 请求默认分类数据
            getGoodsList((id && id) || defaultId)(dispatch)
        }
    }
}

// 获取商品列表
export const getGoodsList = mallSubId => {
    return async dispatch => {
        const data = await Api.classification({ mallSubId })
        if (data.code === window.SUCCESS) {
            dispatch(_categoryGoodsItem(data.data))
        }
    }

}

