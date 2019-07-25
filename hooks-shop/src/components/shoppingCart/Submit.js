import React, { memo } from 'react'

const Submit = ({ totalPrice, submit }) => {
    return (
        <div className='submit'>
            <div className='submit-pic'>
                合计：<span>￥</span><span className='money'>{totalPrice}</span>
            </div>
            <div className='submit-btn' onClick={submit}>提交订单</div>
        </div>
    )
}
Submit.defaultProps = {
    totalPrice: 0
}
export default memo(Submit)