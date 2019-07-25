import React, { useState, useEffect, useRef, useCallback } from 'react';
import NavHeader from 'public/NavHeader'
import Scroll from 'public/Scroll'
import Api from 'api/api'
import './index.scss'
import { Button } from 'zarm';
import PageHoc from 'c/hoc/PageHoc'
let page = 1

const Order = (props) => {
    let [id, setId] = useState(props.match.params.id)
    let [list, setList] = useState([])
    const scroll = useRef() // 获取dom元素

    useEffect(() => {
        let status = props.match.params.id
        if (status && (status == 0 || status == 1)) {
            setId(status)
            getMyOrder()
        } else {
            props.history.replace('/my')
        }
    }, [props.history, props.match.params.id])

    const goBack = useCallback(() => {
        props.history.push('/my')
    }, [props.history])

    const getMyOrder = async (flag) => {
        if (props.isLocked()) return // 必须等待上一次请求完成
        props.locked()//开始请求之前锁住
        const data = await Api.myOrder({ status: id, page: page })
        if (data.code == window.SUCCESS) {
            props.setTotal(data.data.count)  // 总条数
            props.unLocked() // 解锁
            if (flag && data.data.list.length) {
                props.setNewData(data.data.list)
                setTimeout(() => {
                    if (scroll) {
                        scroll.current.refresh()    // 调用子组件方法
                    }
                }, 200);
                setList(prev => [...prev, ...data.data.list])
            } else {
                props.dataArr.push(...data.data.list)
                setList(data.data.list)
            }
        }
    }

    const goPay = useCallback(id => {
        props.history.push(`/payOk/${id}`)
    }, [props.history])

    // 分页
    const onPullup = () => {
        if (list.length >= 10) {
            if (props.hasMore() && !props.isLocked()) {
                page++
                getMyOrder(true)
            }
        }
    }

    return (
        <div>
            <div className='border-bottom'>
                <NavHeader goBack={goBack} icon={true} title='我的订单' />
            </div>
            <div className='order'>
                <Scroll pullup={true} ref={scroll} onPullup={onPullup}>
                    <div className='scroll-list'>
                        {
                            list.map(item => {
                                return (
                                    <div className='item' key={item._id}>
                                        <div className="top border-bottom">
                                            <div >订单编号: {item.order_id}</div>
                                            <div className="order-ok">
                                                {id == 0 ? '待支付' : '已完成'}
                                            </div>
                                        </div>
                                        {
                                            item.order_list.map(val => {
                                                return (
                                                    <div className="list" key={val._id}>
                                                        <img src={val.image_path} className="good-img" alt='' />
                                                        <div className="good-title">{val.name}</div>
                                                        <div className="good-count">
                                                            <p >￥{val.present_price * val.count}</p>
                                                            <p className="count">x{val.count}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className="timre bottom border-top">创建时间: {item.add_time}</div>
                                        <div className="bottom">收货地址: {item.address}</div>
                                        <div className="bottom">共 {item.order_list.length} 件商品   合计: {item.mallPrice}</div>
                                        {
                                            id == 0 ? <Button block theme="danger" className='btn' onClick={() => goPay(item.order_id)}>去支付</Button> : ''
                                        }
                                    </div>
                                )
                            })
                        }
                        {
                            !list.length ? <div className='no-data'>暂无订单~~</div> : null
                        }
                    </div>
                </Scroll>
            </div>
        </div>
    )

}


export default PageHoc(Order)