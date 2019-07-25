import { Carousel  } from 'zarm';
import React, { memo } from 'react'

const Swipers = ({ slider, details }) => {
    return (
        <div className='swiper-container'>
            <Carousel   autoPlay loop >
                {
                    slider.map((item, i) => {
                        return (
                            <div className="swiper-wrapper" key={item.goodsId} onClick={() => details(item.goodsId)}>
                                <img src={item.image} alt="" draggable={false} />
                            </div>
                        )
                    })
                }
            </Carousel >
        </div>
    )
}

Swipers.defaultProps = {
    slider: []
}


export default memo(Swipers)