
import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom'
import './public.scss'
const GoodsItem = (props) => {
    const details = useCallback(id => {
        props.history.push({ pathname: '/details/' + id })
    },[props.history])

    const deleteItem = useCallback((e,id) => {
        e.stopPropagation();
        props.deleteItem(id)
    },[props])

    return (
        <div className='goods-item border-bottom' onClick={() => details(props.goodsItem.id||props.goodsItem.cid)}>
            <div className='border lefts'><img style={{ 'objectFit': props.isCollection || props.isPayMent? 'scale-down' : '' }} src={props.goodsItem.image_path} alt='' /></div>
            <div className='right'>
                <p className='name'>{props.goodsItem.name}</p>
                <p className='price'>
                    <span className='pic'>￥{props.goodsItem.count?props.goodsItem.present_price*props.goodsItem.count:props.goodsItem.present_price}</span>
                    {
                        !props.isCollection ? <span className='orl-pic'>{props.goodsItem.orl_price}</span> : null
                    }
                    {
                        props.isPayMent ? <span className='count'>x{props.goodsItem.count}</span> : null
                    }
                </p>
                {
                    props.isCollection ? <i onClick={(e) => deleteItem(e, props.goodsItem.cid)} className="fa fa-close" aria-hidden="true"></i> : null
                }
            </div>
        </div>
    )
}


export default withRouter(GoodsItem)