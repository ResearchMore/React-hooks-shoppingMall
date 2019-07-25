import React, { useCallback, useState, useEffect } from 'react';
import NavHeader from 'public/NavHeader'
import { Radio, Button } from 'zarm';
import Scroll from 'public/Scroll'
import Api from 'api/api'
import './index.scss'
import { toast } from 'js/utils'
const AddressList = ({ history }) => {
    let [list, setList] = useState([])
    const getAddress = async () => {
        const data = await Api.getAddress()
        if (data.code === window.SUCCESS) {
            setList(data.data)
        }
    }

    const goBack = useCallback(() => {
        history.goBack()
    }, [history])

    // 设置默认地址
    const onChange = async id => {
        const data = await Api.setDefaultAddress({ id })
        if (data.code === window.SUCCESS) {
            toast(data.msg)
            getAddress()
        }
    }
    const addressEdit = useCallback((e, id) => {
        e.persist()
        history.push('/addressEdit/' + id);
    }, [history])

    const goAddress = useCallback(() => {
        history.push('/addressEdit/null')
    }, [history])

    useEffect(() => {
        getAddress()
    }, [])
    return (
        <div>
            <div className='border-bottom'>
                <NavHeader goBack={goBack} icon={true} title='地址列表' />
            </div>
            <div className='address-list'>
                <Scroll>
                    <Radio.Group type="cell" shape='round' onChange={e => onChange(e)}>
                        {
                            list.map(item => {
                                return (
                                    <Radio value={item._id} key={item._id} className='item border-bottom'>
                                        <div className='item-cell'>
                                            <p>{item.name}，{item.tel}</p>
                                            <span>{item.area + '--' + item.addressDetail}</span>
                                            <i className="fa fa-edit" aria-hidden="true" onClick={(e) => addressEdit(e, item._id)}></i>
                                            {item.isDefault ? <i className="fa fa-dot-circle-o" aria-hidden="true"></i> : null}
                                        </div>
                                    </Radio>
                                )
                            })
                        }
                    </Radio.Group>
                </Scroll>

                <Button block theme="danger" className='btn' onClick={goAddress}>增加地址</Button>
            </div>
            {
                !list.length ? <div className='no-data'>暂无地址~~</div> : null
            }
        </div>
    )
}


export default AddressList;