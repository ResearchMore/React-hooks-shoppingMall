import React, { memo, useCallback } from 'react';
import './index.scss'
import { addShop } from 'js/utils'
import { withRouter } from 'react-router-dom'


const GoodsSku = ({ history,id }) => {
    const addCard = useCallback(() => {
        addShop(id)
    }, [id])

    return (
        <div className='goods-sku border-top'>
            <div className='home' onClick={() => history.push('/')}>
                <i className="fa fa-home" aria-hidden="true"></i>
                <span>首页</span>
            </div>
            <div className='home' onClick={() => history.push('/shoppingCart')}>
                <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                <span>购物车</span>
            </div>
            <div className='immediately' onClick={addCard}>加入购物车</div>
            <div className='immediately immediately2'>立即购买</div>
        </div>
    )
}

export default withRouter(memo(GoodsSku)) 