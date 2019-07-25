import React, { useState, useCallback, useEffect } from 'react';
import NavHeader from 'public/NavHeader'
import { Input, Cell, Switch, Picker, Button, Confirm } from 'zarm';
import area from 'js/area'
import { toast } from 'js/utils'
import Api from 'api/api'
const AddressEdit = ({ match, history }) => {
    let [username, setUsername] = useState('')
    let [phone, setPhone] = useState('')
    let [address, setAddress] = useState('')
    let [isDefault, setIsDefault] = useState(false)
    let [pickerVisible, setPickerVisible] = useState(false)
    let [areaTxt, setAreaTxt] = useState('')
    let [addressTitle, setAddressTitle] = useState('新增地址')
    let [confirm, setConfirm] = useState(false)
    let [cascade] = useState({
        dataSource: area,
        value: ['110000', '110000'],
        valueMember: 'code'
    })
    let id = match.params.id !== 'null' ? match.params.id : undefined
    const goBack = () => {
        history.push('/addressList')
    }

    const handleInputChange = useCallback((e, name) => {
        if (name === 'picker') {
            setPickerVisible(true)
        } else if (name === 'username') {
            setUsername(e)
        } else if (name === 'phone') {
            setPhone(e)
        } else {
            setAddress(e)
        }
    }, [])

    const pickerSelected = useCallback((e) => {
        setPickerVisible(false)
        setAreaTxt(e.map(item => item.label).join(''))
    }, [])
    // 查询单条收货地址
    const getOneAddress = async id => {
        const data = await Api.getOneAddress({ id })
        if (data.code === window.SUCCESS) {
            setUsername(data.data.name)
            setPhone(data.data.tel)
            setAddress(data.data.addressDetail)
            setIsDefault(data.data.isDefault)
            setAreaTxt(data.data.area)
            setAddressTitle('编辑地址')
        }
    }

    // 删除单条收货地址
    const deletes = async () => {
        setConfirm(false)
        const data = await Api.deleteAddress({ id })
        if (data.code === window.SUCCESS) {
            toast(data.msg)
            setTimeout(() => {
                goBack()
            }, 1000);
        }
    }
    // 增加和修改地址
    const save = async () => {
        if (!username || !phone || !areaTxt || !address) {
            return toast('请填写完整信息', 'error')
        }

        const data = await Api.setAddress({
            name: username,
            tel: phone,
            area: areaTxt,
            addressDetail: address,
            isDefault: isDefault,
            id
        })

        if (data.code === window.SUCCESS) {
            toast(data.msg)
            setTimeout(() => {
                goBack()
            }, 1000);
        }
    }

    useEffect(() => {
        if (id) {
            getOneAddress(id)
        }
    }, [id])

    return (
        <div>
            <NavHeader goBack={goBack} icon={true} title={addressTitle} />
            <div className='border-top'>
                <Cell title="姓名">
                    <Input clearable type="text" maxLength={10} placeholder="收货人姓名" defaultValue={username} onChange={(e) => handleInputChange(e, 'username')} />
                </Cell>
                <Cell title="电话">
                    <Input clearable type="text" maxLength={11} placeholder="收货人电话" defaultValue={phone} onChange={(e) => handleInputChange(e, 'phone')} />
                </Cell>
                <Cell title="地区">
                    <Input clearable type="text" maxLength={11} defaultValue={areaTxt} placeholder="选择省/市/区" disabled={pickerVisible} onFocus={(e) => handleInputChange(e, 'picker')} />
                </Cell>
                <Cell title="详细地址">
                    <Input maxLength={50} showLength type="text" autoHeight rows={2} placeholder="街道门牌、楼层房间号等信息" value={address} onChange={(e) => handleInputChange(e, 'address')} />
                </Cell>
                <Cell description={<Switch checked={isDefault}
                    onChange={(value) => {
                        setIsDefault(value)
                    }} />} >
                    是否设为默认地址
                </Cell>
                <Picker
                    visible={pickerVisible}
                    value={cascade.value}
                    dataSource={cascade.dataSource}
                    valueMember={cascade.valueMember}
                    cancelText='取消'
                    okText='确定'
                    title='请选择'
                    onOk={(selected) => pickerSelected(selected)}
                    onMaskClick={() => setPickerVisible(false)}
                    onCancel={() => setPickerVisible(false)}
                />
            </div>
            <Cell>
                <Button style={{ marginTop: '10vw' }} block theme="primary" onClick={save}>保存</Button>
            </Cell>
            {
                addressTitle != '新增地址' ? (
                    <Cell>
                        <Button style={{ marginTop: '5vw' }} block theme="danger" onClick={() => setConfirm(true)}>删除</Button>
                    </Cell>
                ) : ''
            }

            <Confirm
                shape="radius"
                visible={confirm}
                title="确认信息"
                message="你确定删除地址吗？"
                onOkText='111'
                onOk={deletes}
                onCancel={() => setConfirm(false)}
            />
        </div>
    )
}

export default AddressEdit