import React, { memo, useCallback } from 'react';
import { withRouter } from 'react-router-dom'
const tabs = [
    { status: 0, icon: "fa fa-credit-card-alt", title: "待付款" },
    { status: 1, icon: "fa fa-heart", title: "已完成" }
]
const cell = [
    { id: 1, icon: "fa fa-thumbs-up", title: "评价管理", path: '/order' },
    { id: 2, icon: "fa fa-star", title: "商品收藏", path: '/collection' },
    { id: 3, icon: "fa fa-rocket", title: "地址管理", path: '/addressList' },
    { id: 4, icon: "fa fa-eye", title: "最近浏览", path: '/browse' }
]
const TabItems = ({ numList, history }) => {
    const pushOrder = useCallback(status => {
        history.push(`/order/${status}`)
    }, [history])

    return (
        <div>
            <div className='user-links border-bottom'>
                {
                    tabs.map((item, index) => {
                        return (
                            <div key={item.status} onClick={() => pushOrder(item.status)} className={`${index === 0 ? 'border-right' : ''}`}>
                                <i className={item.icon} aria-hidden="true"></i>
                                <span className='titles'>{item.title}</span>
                                {index === 0 && numList[0] > 0 ? <span className='count'>{numList[0] > 99 ? '99+' : numList[0]}</span> : ''}
                            </div>
                        )
                    })
                }
            </div>
            <div className='cell border-top'>
                {
                    cell.map(item => {
                        return (
                            <div key={item.id} className='border-bottom' onClick={() => history.push(item.path)}>
                                <i className={item.icon} aria-hidden="true"></i>
                                <span>{item.title}</span>
                                <i className="fa fa-angle-right right" aria-hidden="true"></i>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
TabItems.defaultProps = {
    numList: []
};
export default withRouter(memo(TabItems))