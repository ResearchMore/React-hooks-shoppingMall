import React, { useState, useEffect, useCallback } from 'react';
import NavHeader from 'public/NavHeader'
import { Radio, Button, Toast, Confirm, Alert } from 'zarm';
import './index.scss'
import Api from 'api/api'
const PayOk = ({ match, history }) => {
    let [btn, setBtn] = useState(true)
    let [confirm, setConfirm] = useState(false)
    let [alert, setAlert] = useState(false)
    let [mallPrice, setMallPrice] = useState('')
    let id = match.params.id
    useEffect(() => {
        getOrderDetils(id)
    }, [id])

    const goBack = useCallback(() => {
        setConfirm(true)
    }, [])

    const back = useCallback(() => {
        history.goBack()
    }, [history])

    const onChange = useCallback(e => {
        e = Number(e)
        let flag
        if (e === 1 || e === 2) {
            flag = false
            Toast.show('暂未实现', 500);
        } else {
            flag = true
        }
        setBtn(flag)
    }, [])

    const pay = async () => {
        // 支付
        const data = await Api.payOrder({ order_id: id })
        if (data.code === window.SUCCESS) {
            setTimeout(() => {
                setAlert(true)
            }, 400);

        }
    }

    const offAlert = useCallback(() => {
        back()
    }, [back])

    const getOrderDetils = async order_id => {
        const data = await Api.getOrderDetils({ order_id })
        if (data.code === window.SUCCESS) {
            if (data.data.status === 0) {
                setMallPrice(data.data.mallPrice)
            } else {
                Toast.show(`该订单已完成`, 500);
                setTimeout(() => {
                    back()
                }, 1000);
            }
        }
    }

    return (
        <div className='pay-ok'>
            <div>
                <NavHeader goBack={goBack} icon={true} title='支付详情' />
            </div>
            <Radio.Group type="cell" onChange={e => onChange(e)}>
                <Radio className='border-bottom' value="0"><i className="fa fa-check-square" aria-hidden="true"></i>普通支付</Radio>
                <Radio className='border-bottom' value="1"><i className="fa fa-weixin" aria-hidden="true"></i>支付宝</Radio>
                <Radio className='border-bottom' value="2"><i className="fa fa-weixin" aria-hidden="true"></i>微信</Radio>
            </Radio.Group>

            {btn && mallPrice ? <Button className='btn' onClick={pay} block theme="danger">支付</Button> : ''}
            <Confirm
                shape="radius"
                visible={confirm}
                title="提示"
                message="当前订单未支付,确定要返回吗？"
                onOk={() => back()}
                onCancel={() => setConfirm(false)}
            />
            <Alert
                shape="radius"
                visible={alert}
                title="提示"
                message={`支付成功,一共${mallPrice}元`}
                onCancel={offAlert}
            />
        </div>
    )
}


export default PayOk;