import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.scss'
import Tabs from 'c/details/Tabs'
import GoodsSku from 'c/details/GoodsSku'
import { connect } from 'react-redux'
import * as action from './store/action'
import Scroll from 'public/Scroll'
const Details = ({ goodsOne, match, dispatch, history }) => {
    let page = 1
    let id = match.params.id
    let [isCollection, setIsCollection] = useState(0)
    const scroll = useRef() // 获取dom元素

    const goBack = useCallback(() => {
        history.goBack()
    }, [history])

    const onPullup = () => {
        scroll.current.refresh()    // 调用子组件方法
    }

    // 点击收藏
    const collection = useCallback(id => {
        dispatch(action.collection(id, isCollection, setIsCollection))
    }, [dispatch, isCollection])

    useEffect(() => {
        dispatch(action.getGoodsDetails(id, page))
    }, [dispatch, id,page])

    useEffect(() => {
        dispatch(action.isCollection(id, setIsCollection))
    }, [dispatch,id])

    return (
        <div>
            <div className="icon-back" onClick={goBack}>
                <i className="fa fa-angle-left" aria-hidden="true"></i>
            </div>
            <div className='details'>
                <Scroll ref={scroll} pullup={true} onPullup={onPullup}>
                    <div className='banner'><img src={goodsOne.image} alt='' /></div>
                    <div className='goods-name border-top border-bottom'>
                        <div className='goods-title'>{goodsOne.name}</div>
                        <div className='pic'>￥{goodsOne.present_price}</div>
                    </div>
                    <div className='goods-express border-topbottom'>
                        <span>运费：0</span>
                        <span>剩余：10000</span>
                        <span>
                            {isCollection == 0 ? '收藏：' : '取消收藏  '}
                            <i style={{ color: `${isCollection != 0 ? 'red' : ''}` }} className={`fa  ${isCollection == 0 ? 'fa-heart-o' : 'fa-heart'}`} onClick={() => collection(id)} aria-hidden="true"></i>
                        </span>
                    </div>
                    <Tabs detail={goodsOne.detail} />

                </Scroll>
            </div>
            <GoodsSku id={goodsOne.id} />
        </div>
    )
}

const mapState = state => ({
    goodsOne: state.detail.goods_details.goodsOne
})

const mapActions = dispatch => ({
    dispatch
})

Details.defaultProps = {
    goodsOne: {}
};

export default connect(mapState, mapActions)(Details) 