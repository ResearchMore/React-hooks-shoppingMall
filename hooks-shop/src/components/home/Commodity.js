import React, { memo, useEffect } from 'react';
import { addShop } from 'js/utils'
import Swiper from 'swiper/dist/js/swiper.js'
const Commodity = ({ goodItem,details }) => {
    
    useEffect(() => {
        new Swiper('.swiper-container1', {
            slidesPerView: 3,
            loop: false,
            autoplay: false,
            observer: true,
        })
    }, [])

    const onAddShop = (e,id) => {
        e.stopPropagation();
        addShop(id)
    }

    return (
        <div className='commodity'>
            <div className='border-bottom titles'>商品推荐</div>
            <div className="swiper-container1">
                <div className="swiper-wrapper">
                    {
                        goodItem.map(item => {
                            return (
                                <div className="swiper-slide border-right" key={item.goodsId} onClick={() => details(item.goodsId)}>
                                    <div className='recommend-item'>
                                        <img src={item.image} alt='' />
                                        <p className='name'>{item.goodsName}</p>
                                        <p className='price'>
                                            <span className='code'>￥</span>
                                            <span className='mallPrice'>{item.mallPrice}</span>
                                            <span className='price-min'>￥{item.price}</span>
                                        </p>
                                        <div className='item'>
                                            <div className='left' onClick={(e) => onAddShop(e, item.goodsId)}><i className="fa fa-shopping-cart" aria-hidden="true"></i></div>
                                            <div className='right'>查看详情</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

Commodity.defaultProps = {
    goodItem: []
};

export default memo(Commodity)

