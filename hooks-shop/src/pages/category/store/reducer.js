import * as types from './types'
const defauleState = {
    category: [],
    goodsItem: []
}

const reducer = (state = defauleState, action) => {
    if (action.type === types.CATEGORY_TABS) {
        return {
            ...state,
            category: action.data
        }
    }

    if (action.type === types.CATEGORY_GOODS_ITEM) {
        return {
            ...state,
            goodsItem: action.data
        }
    }

    if (action.type === types.CATEGORY_GOODS_CLEAR) {
        return {
            ...state,
            goodsItem: []
        }
    }
    return state
}

export default reducer



