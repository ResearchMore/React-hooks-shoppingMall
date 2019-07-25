import * as types from './types'
const defauleState = {
    shopList: [],
    orderList: [],
    totalPrice:0,
}

const reducer = (state = defauleState, action) => {
    if (action.type === types.SHOP_LIST) {
        
        return {
            ...state,
            shopList:action.data
        }
    }
    if (action.type === types.ORDER_LIST) {
       
        return {
            ...state,
            orderList:action.data
        }
    }
    if (action.type === types.TOTAL_PRICE) {
        return {
            ...state,
            totalPrice:action.data
        }
    }
    return state
}

export default reducer



