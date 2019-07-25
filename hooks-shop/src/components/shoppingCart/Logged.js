import React, { useState, useEffect, useCallback } from 'react';
import { Stepper, Confirm } from 'zarm';
import { toast } from 'js/utils'
import Api from 'api/api'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import * as action from 'pages/shoppingCart/store/action'

const Logged = ({ shopList, getCard, dispatch, history }) => {
    let [selectAll, setSelectAll] = useState([]) // 选中的数组
    let [checkedAll, setCheckedAll] = useState(false)    //全选状态
    let [checkFlag, setCheckFlag] = useState(false)    //是否有商品处于选中状态
    let [totalPrice, setTotalPrice] = useState(0.00)    // 总价格
    let [list, setList] = useState(shopList)    //全选状态
    let [confirm, setConfirm] = useState(false)    //全选状态

    useEffect(() => {
        setList(shopList)
    }, [getCard, shopList])

    // 计算总价的方法
    const totalPriceFn = useCallback(list => {
        return list.map(item => item.count * item.present_price).reduce((prev, cur) => (prev + cur), 0).toFixed(2)
    }, [])

    const css = useCallback((zindex) => {
        let ele = document.querySelector('.nav-footer')
        ele.style.zIndex = zindex
    }, [])

    // 全选操作
    const changeAll = useCallback(() => {
        setCheckedAll(checkedAll => !checkedAll)
        if (!checkedAll) {   // 全选
            setList(prev => prev.map(item => ({ ...item, check: true })))
            setCheckFlag(true)
            setTotalPrice(totalPriceFn(list))
            setSelectAll(list)
        } else {   // 取消全选
            setList(prev => prev.map(item => ({ ...item, check: false })))
            setCheckFlag(false)
            setTotalPrice(0.00)
            setSelectAll([])
        }
    }, [checkedAll, list, totalPriceFn])

    // 单选操作
    const changeItem = useCallback((id) => {
        let arr = [...list]
        let arr2 = arr.map(item => {
            if (item.cid == id) {
                if (!item.check) {
                    item.check = true
                } else {
                    item.check = false
                }
            }
            return {
                ...item
            }
        })
        // 勾住单选后全选
        // 获取单选的数组
        let sarr = arr2.filter(v => v.check == true)
        setSelectAll(sarr)
        // 判断单选的数组是不是等于商品的总共数组，如果是就是全选，否则就不是全选
        sarr.length == arr.length ? setCheckedAll(true) : setCheckedAll(false)
        setCheckFlag(sarr.length ? true : false)
        setTotalPrice(totalPriceFn(sarr))
    }, [list, totalPriceFn])



    // 保留两位小数
    const toFixed = useCallback((pic) => {
        return pic.toFixed(2)
    }, [])

    // 购物车加减
    const stepper = async (count, id) => {
        const data = await Api.editCart({ count, id })
        if (data.code === window.SUCCESS) {
            let arr = [...list]
            arr.forEach((item, index) => {
                if (item.cid == id) {
                    arr[index].count = count
                }
            })
            let selectAll = arr.filter(v => v.check == true)
            setList(arr)
            setTotalPrice(totalPriceFn(selectAll))
        }
    }

    // 购物车删除
    const deleteShop = useCallback(() => {
        css(-1)
        setConfirm(true)
    }, [css])

    const onOk = async () => {
        const ids = selectAll.map(item => {
            return item.cid
        })
        css(1)
        const data = await Api.deleteShop(ids)
        if (data.code === window.SUCCESS) {
            toast(data.msg)
            setConfirm(false)
            setCheckFlag(false)
            // 调用方法再请求一次数据
            getCard()
        }
    }

    const onCancel = useCallback(() => {
        css(1)
        setConfirm(false)
    }, [css])

    // 去结算
    const settlement = useCallback(() => {
        dispatch(action.setOrderList(selectAll))
        dispatch(action.totalPrice(totalPrice))
        history.push('/payMent')
    }, [dispatch, history, selectAll, totalPrice])



    useEffect(() => {
        setTimeout(() => {
            let ele = Array.from(document.querySelectorAll('.za-stepper__input'))
            ele.forEach(item => {
                item.setAttribute('disabled', 'disabled')
            })
        }, 100);
    }, [])

    return (
        <div className='logged'>
            <div className='goods-item2 count border-bottom'>
                <div className='select'>
                    <input type='checkbox' checked={checkedAll} onChange={changeAll} />
                </div>
                <div className='conut-pic'>
                    <p>
                        <span>合计：</span>
                        <span className='pic'>￥{totalPrice}</span>
                    </p>
                    {checkFlag ? <p className='order-ok'>请确认订单</p> : null}

                </div>
            </div>
            {
                checkFlag ? (
                    <div className="confirm">
                        <div onClick={deleteShop}>删除</div>
                        <div onClick={settlement}>去结算</div>
                    </div>
                ) : null
            }

            {/* 以下是商品 */}
            {
                list.map(item => {
                    return (
                        <div className='goods-item2 border-bottom' key={item.cid}>
                            <div className='select'>
                                <input type='checkbox' checked={item.check} onChange={() => changeItem(item.cid)} />
                            </div>
                            <div className='border pictures'><img src={item.image_path} alt='' /></div>
                            <div className='trade-warp'>
                                <p className='trade-name'>{item.name}</p>
                                <div>
                                    <p className='price'><span>￥</span>{toFixed(item.present_price * item.count)}</p>
                                    <p><Stepper shape="circle" defaultValue={item.count} min={1} max={20} onChange={(e) => stepper(e, item.cid)} /></p>
                                </div>
                            </div>
                        </div>
                    )
                })
            }

            {/* alert确认框框 */}
            <Confirm
                shape="radius"
                visible={confirm}
                title="确认信息"
                message="确定要删除商品吗？"
                onOk={onOk}
                onCancel={onCancel}
            />
        </div>
    )
}

Logged.defaultProps = {
    shopList: []
}

const mapActions = dispatch => ({
    dispatch
})
export default withRouter(connect(null, mapActions)(Logged))