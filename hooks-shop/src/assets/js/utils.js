import { Toast, Icon } from 'zarm';
import React from 'react'
import Api from 'api/api'
export const toast = (title, type) => {
    type = type === 'error' ? 'wrong-round' : 'right-round'
    Toast.show(
        (<div className="box">
            <Icon className="box-icon error-icon" type={type} />
            <div className="box-text">
                {title}
            </div>
        </div>), 700
    )
}

export const addShop = async id => {
    const data = await Api.addShop({ id })
    if (data.code === window.SUCCESS) {
        toast(data.msg)
    } else {
        toast('加入购物车失败','error')
    }

}