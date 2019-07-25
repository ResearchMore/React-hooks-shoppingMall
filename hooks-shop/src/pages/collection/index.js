import React, { useRef, useState, useEffect, useCallback } from 'react'
import NavHeader from 'public/NavHeader'
import Scroll from 'public/Scroll'
import Api from 'api/api'
import './index.scss'
import GoodsItem from 'public/GoodsItem'
import PageHoc from 'c/hoc/PageHoc'
let page = 1

const Collection = (props) => {
    let [list, setList] = useState([])
    const goBack = () => {
        props.history.push('/my')
    }
    const scroll = useRef() // 获取dom元素
    // 分页
    const onPullup = useCallback(() => {
        if (list.length >= 10) {
            if (props.hasMore() && !props.isLocked()) {
                page++
                getCollectionList(true)
            }
        }
    }, [list.length])

    const getCollectionList = async (flag) => {
        if (props.isLocked()) return // 必须等待上一次请求完成
        props.locked()//开始请求之前锁住
        const data = await Api.getCollectionList({ page })
        if (data.code === window.SUCCESS) {
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

    // 删除收藏
    const deleteItem = async id => {
        const data = await Api.cancelCollection({ id })
        if (data.code === window.SUCCESS) {
            page = 1
            props.clearArr()
            if (scroll) {
                scroll.current.scrollTo(0, 0, 300)    // 调用子组件方法
            }
            getCollectionList()
        }
    }



    useEffect(() => {
        getCollectionList()
    }, [])
    return (
        <div>
            <NavHeader goBack={goBack} icon={true} title='我的收藏' />
            <div className=' border-top'>
                <div className='collection'>
                    <Scroll pullup={true} ref={scroll} isToelement={true} onPullup={onPullup}>
                        {
                            list.map(item => {
                                return <GoodsItem isCollection={true} key={item._id} goodsItem={item} deleteItem={deleteItem} />
                            })
                        }
                    </Scroll>
                </div>
            </div>
            {
                !list.length ? <div className='no-data'>暂无收藏商品~~</div> : null
            }
        </div>
    );


}

export default PageHoc(Collection)