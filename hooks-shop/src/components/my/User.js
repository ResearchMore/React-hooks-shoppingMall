import React, { memo, useCallback } from 'react';
import { withRouter } from 'react-router-dom'
import './index.scss'
const User = ({ history }) => {
    const goLogin = useCallback(() => {
        history.push('/login')
    }, [history])

    const loginOut = useCallback(() => {
        localStorage.clear()
        history.push('/login')
    }, [history])

    return (
        <div className='user'>
            <img src='http://img4.imgtn.bdimg.com/it/u=198369807,133263955&fm=27&gp=0.jpg' alt='' />
            {
                !localStorage.getItem('token') && !localStorage.getItem('username') ? <p onClick={goLogin}>登录/注册</p> : <p onClick={loginOut}><span>{localStorage.getItem('username')}</span>退出登录</p>
            }

        </div>
    )
}


export default withRouter(memo(User))