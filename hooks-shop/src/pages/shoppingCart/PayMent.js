import React, { useState, useEffect, useCallback } from 'react';
import NavHeader from 'public/NavHeader'
import Scroll from 'public/Scroll'
import { Modal, Toast } from 'zarm';
import Api from 'api/api'
import GoodsItem from 'public/GoodsItem'
import * as action from './store/action'
import { connect } from 'react-redux';
import Address from 'c/shoppingCart/Address'
import Submit from 'c/shoppingCart/Submit'
const PayMent = ({ history, orderList, totalPrice, dispatch }) => {
    let [address, setAddress] = useState({})
    let [modal, setModal] = useState(false)
    let [time, setTime] = useState(3)
    let order_id = ''
    useEffect(() => {
        if (!orderList.length) {
            history.push('/shoppingCart')
        } else {
            getDefaultAddress()
        }
    }, [history, orderList.length])

    const getDefaultAddress = async () => {
        const data = await Api.getDefaultAddress()
        if (data.code === window.SUCCESS) {
            setAddress({ ...address, ...data.data })
        }
    }

    const goBack = useCallback(() => {
        history.push('/shoppingCart')
    }, [history])

    // 去支付
    const submit = useCallback(() => {
        if (!address._id) {
            return Toast.show('请添加收货地址', 500);
        }
        setModal(true)
        placeOrder()
        let timeNum = 3
        let timer = setInterval(() => {
            timeNum--
            if (timeNum < 0) {
                clearInterval(timer)
                if (order_id) {
                    history.push('/payOk/' + order_id);
                }
            } else {
                setTime(timeNum)
            }
        }, 1000);
    }, [address._id, history, order_id])

    const placeOrder = async () => {
        if (!address._id) {
            return Toast.show('请添加收货地址', 500);
        }
        let goodsIds = orderList.map(item => {
            return item.cid
        })
        const data = {
            addressId: address._id,
            goodsIds,
        }
        const res = await Api.placeOrder(data)
        if (res.code === window.SUCCESS) {
            order_id = res.data
            dispatch(action.setOrderList([]))
        }
    }

    return (
        <div>
            <div className='border-bottom'>
                <NavHeader goBack={goBack} icon={true} title='订单结算' />
            </div>
            <Address address={address} />
            <div className='payMent'>
                <Scroll>
                    {
                        orderList.map(item => {
                            return <GoodsItem isPayMent={true} key={item._id} goodsItem={item} />
                        })
                    }
                </Scroll>
            </div>
            <Submit totalPrice={totalPrice} submit={submit} />
            <Modal visible={modal} onMaskClick={() => console.log()}>
                <Modal.Header title="提示" />
                <Modal.Body style={{ textAlign: 'center' }}>正在生成订单中 {time}</Modal.Body>
            </Modal>
        </div >

    )
}

const mapState = state => ({
    orderList: state.shoppingCart.orderList,
    totalPrice: state.shoppingCart.totalPrice,
})

const mapActions = dispatch => ({
    dispatch
    // setOrderList(list) {
    //     dispatch(action_fn.setOrderList(list))
    // }
})
export default connect(mapState, mapActions)(PayMent)