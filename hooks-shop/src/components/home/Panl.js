import React, { memo,useCallback } from 'react'
import { withRouter } from 'react-router-dom'
const Panl = ({ panlList, history }) => {
    const panlItem = useCallback((id, index) => {
        history.push({ pathname: '/category', query: { id, index } })
    },[history])
    return (
        <div className='panl'>
            <ul>
                {
                    panlList.map((item, index) => {
                        return (
                            <li key={item.mallCategoryId} onClick={() => panlItem(item.bxMallSubDto[0].mallSubId, index)}>
                                <img src={item.image} alt='' />
                                <p>{item.mallCategoryName}</p>
                            </li>
                        )
                    })
                }
            </ul>
            <div className='ad'><img src='http://images.baixingliangfan.cn/advertesPicture/20180404/20180404085441_850.gif' alt='' /></div>
        </div>
    )
}

Panl.defaultProps = {
    panlList: []
};
export default withRouter(memo(Panl))