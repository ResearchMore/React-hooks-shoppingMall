import React, { useEffect, useState, useRef, useCallback } from 'react';
import NavFooter from 'public/NavFooter'
import { connect } from 'react-redux'
import * as action from './store/action'
import GoodsItem from 'public/GoodsItem'
import Scroll from 'public/Scroll'
import './index.scss'
import { NavBar } from 'zarm';
const Category = props => {
    const { category: { category } } = props
    const { category: { goodsItem } } = props
    const { dispatch } = props

    let [leftTabIndex, setLeftTabIndex] = useState(0)
    let [rightTabIndex, setRightTabIndx] = useState(0)
    let [list, setList] = useState([])

    const scroll = useRef() // 获取dom元素
    // 动态设置宽度
    const getEle = useCallback(width => {
        let ele
        if (width === 3) {
            setTimeout(() => {
                ele = document.querySelector('.tab-title')
                let childNodes = Array.from(ele.childNodes)
                ele.style.width = '100%'
                childNodes.forEach(item => {
                    item.style.width = '33.333%'
                })
            }, 0);

        } else {
            ele = document.querySelector('.tab-title')
            ele.style.width = (21.333 * width) + 'vw'
        }
    },[])
    
    useEffect(() => {
        const id = (props.location.query && props.location.query.id) || null
        const index = (props.location.query && props.location.query.index) || 0
        setLeftTabIndex(index)
        dispatch(action.getCategory(setList,index, id,getEle))
        // getEle(val.bxMallSubDto.length)
        
    }, [dispatch,props.location.query,getEle])

    useEffect(() => {
        let ele = document.querySelector('.tab-title')
        ele.style.width = (21.333 * 4) + 'vw'
    }, [])

    
    
    // 点击左侧列表
    const onLeftTab = useCallback((val, index) => {
        if (leftTabIndex === index) {
            return
        }
        const id = category[index].bxMallSubDto[0].mallSubId
        setTimeout(() => {
            dispatch(action.getGoodsList(id))
        }, 0);
        setLeftTabIndex(index)
        setList(val.bxMallSubDto)
        setRightTabIndx(0)
        getEle(val.bxMallSubDto.length)
        scroll.current.scrollTo(0, 0, 300)    // 调用子组件方法
    }, [category, leftTabIndex,dispatch,getEle])

    // 点击右侧侧侧列表
    const onRightTab = useCallback((val, index) => {
        if (rightTabIndex === index) {
            return
        }
        const id = category[leftTabIndex].bxMallSubDto[index].mallSubId
        setTimeout(() => {
            dispatch(action.getGoodsList(id))
        }, 0);
        setRightTabIndx(index)
    }, [category, rightTabIndex,dispatch,leftTabIndex])

    
    return (
        <div>
            <NavBar title="商品分类" className='border-bottom' />
            <div className='content'>
                <ul className='left'>
                    {
                        category.map((item, index) => {
                            return (
                                <li onClick={() => onLeftTab(item, index)} className={`${leftTabIndex === index ? 'active' : ''}`} key={item.mallCategoryId}>{item.mallCategoryName}</li>
                            )
                        })
                    }
                </ul>
                <div className='right'>
                    <div className='tab-title'>
                        {
                            list.map((item, index) =>
                                (<div onClick={() => onRightTab(item, index)} className={`tab-item ${rightTabIndex === index ? 'active' : ''}`} key={item.mallSubId}>{item.mallSubName}</div>))
                        }
                    </div>
                    <div className="scroll-warpper-category">
                        <Scroll ref={scroll} isToelement={true}>
                            {
                                goodsItem.map(item => {
                                    return <GoodsItem key={item.id} goodsItem={item} />
                                })
                            }
                        </Scroll>
                    </div>
                </div>
            </div>
            <NavFooter active={1} />
        </div>
    )
}





const mapState = state => {
    return state
}

const mapDispatchToProps = dispatch => ({
    dispatch
})

export default connect(mapState, mapDispatchToProps)(Category)