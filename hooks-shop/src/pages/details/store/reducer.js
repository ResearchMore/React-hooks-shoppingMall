import * as types from './types'
const defauleState = {
    goods_details: {},
}

const reducer = (state = defauleState, action) => {
    if (action.type === types.GOODS_DETAILS) {
        return {
            ...state,
            goods_details: action.data
        }
    }
    return state
}

export default reducer



