import React, { useCallback,memo } from 'react';
import { withRouter } from 'react-router-dom'
import './public.scss'
const footer = [
    { title: '商城', icon: 'fa fa-home', id: 0, path: '/home' },
    { title: '分类', icon: 'fa fa-align-justify fa-a', id: 1, path: '/category' },
    { title: '购物车', icon: 'fa fa-shopping-cart', id: 2, path: '/shoppingCart' },
    { title: '我的', icon: 'fa fa-user', id: 3, path: '/my' },
]
const NavFooter = ({ active,history }) => {
    const onRoute = useCallback((path, id) =>{
        if (id === active) {
            return
        }
        history.push(path)
    },[active,history])
    return (
        <div className='nav-footer'>
            {
                footer.map(item => {
                    return (
                        <div className={`item ${active === item.id ? 'active' : 0}`} key={item.id} onClick={() => onRoute(item.path, item.id)}>
                            <i className={item.icon} aria-hidden="true"></i>
                            <span>{item.title}</span>
                        </div>
                    )
                })
            }
        </div>
    );
}

NavFooter.defaultProps = {
    active: 0
}

export default withRouter(memo(NavFooter))