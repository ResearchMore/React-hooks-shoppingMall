import React, { useEffect, useState } from 'react';
import NavFooter from 'public/NavFooter'
import User from 'c/my/User'
import TabItems from 'c/my/TabItems'
import { NavBar } from 'zarm';
import Api from 'api/api'
const My = () => {
    let [numList, setNumList] = useState([])

    const getOrderNum = async () => {
        const data = await Api.orderNum()
        if (data.code === window.SUCCESS) {
            setNumList(data.data.numList)
        }

    }

    useEffect(() => {
        getOrderNum()
    },[])

    return (
        <>
            <NavBar title="我的" className='border-bottom' />
            <User />
            <TabItems numList={numList} />
            <NavFooter active={3} />
        </>
    )
}
export default My
