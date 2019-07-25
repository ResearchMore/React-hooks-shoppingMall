import * as types from './types'
import Api from 'api/api'
const _shoppingList = data => ({
    type: types.SHOP_LIST,
    data
})

const _orderList = data => ({
    type: types.ORDER_LIST,
    data
})


// 查询获取购物车
export const getCard = () => {
    return async dispatch => {
        const data = await Api.getCard()
        if (data.code === window.SUCCESS) {
            dispatch(_shoppingList(data.data))
        }
    }
}

// 选中的商品区结算
export const setOrderList = list => {
    return async dispatch => {
        dispatch(_orderList(list))
    }
}

// 商品价格
export const totalPrice = data => {
    return async dispatch => {
        dispatch({
            type: types.TOTAL_PRICE,
            data
        })
    }
}
