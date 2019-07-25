import React, { memo, useCallback } from 'react'
import shop from 'img/shop.png'
import { withRouter } from 'react-router-dom'
import './index.scss'

const NotLogged = ({ history }) => {
    const goLogin = useCallback(() => {
        history.push('/login/index');
    }, [history])

    const goHome = useCallback(() => {
        history.push('/home');
    }, [history])

    return (
        <div className='not-logged'>
            <div className='shop'><img src={shop} alt='' /></div>

            <p className="desc">
                {
                    !localStorage.getItem('token') && !localStorage.getItem('username') ? '请先登录噢~~' : '暂无商品~~'
                }
            </p>
            {
                !localStorage.getItem('token') && !localStorage.getItem('username') ? <p className="desc2" onClick={goLogin}>去登录</p> : <p className="desc2" onClick={goHome}>去购物</p>
            }
        </div>
    )
}

export default withRouter(memo(NotLogged))