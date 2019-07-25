import React, { memo} from 'react';
const HotGoods = ({ hotGoodsList,details }) => {

    return (
        <div>
            <div className='title'>热销商品</div>
            <ul className='hot-goods'>
                {
                    hotGoodsList.map(item => {
                        return (
                            <li className='border-top' key={item.goodsId} onClick={() => details(item.goodsId)}>
                                <img src={item.image} alt='' />
                                {/* <Lazyimg className="lazy" src={'http://zhansingsong.github.io/lazyimg/22.4582fc71.jpg'}  /> */}
                                <p className='name'>{item.name}</p>
                                <p className='price'>
                                    <span className="code">￥</span>
                                    <span className="mallPrice">{item.mallPrice}</span>
                                    <span className="price-min">{item.price}</span>
                                </p>
                            </li>
                        )
                    })
                }

            </ul>
        </div>
    )
}

HotGoods.defaultProps = {
    hotGoodsList: [],
};
export default memo(HotGoods)