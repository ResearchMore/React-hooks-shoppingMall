import React, { useEffect, useCallback, useState, useRef } from 'react'
import './index.scss'
import Search from 'c/home/Search'
import Swiper from 'c/home/Swiper'
import Panl from 'c/home/Panl'
import Floor from 'c/home/Floor'
import Commodity from 'c/home/Commodity'
import HotGoods from 'c/home/HotGoods'
import NavFooter from 'public/NavFooter'
import Scroll from 'public/Scroll'
import Api from 'api/api'
function Home({ history }) {
    let [recommend, setRecommend] = useState({})
    const scroll = useRef() // 获取dom元素
    const getData = async () => {
        const data = await Api.recommend()
        if (data.code === window.SUCCESS) {
            setRecommend(data.data)
        }
    }
    useEffect(() => {
        getData()
    }, [])

    const details = useCallback(id => { //  跳转详情页面
        history.push({ pathname: '/details/' + id })
    }, [history])

    const onPullup = () => {
        if (scroll) {
            scroll.current.refresh()    // 调用子组件方法
        }
    }

 
    const goCity = useCallback(() => { 
        history.push({ pathname: '/city' })
    }, [history])

    return (
        <>
            <Search goCity={goCity} />
            <div className='scroll-warpper'>
                <Scroll pullup={true} ref={scroll} onPullup={onPullup}>
                    <Swiper slider={recommend.slides} details={details} />
                    <Panl panlList={recommend.category} />
                    <Commodity goodItem={recommend.recommend} details={details} />
                    <Floor title='休闲食品' floor={recommend.floor1} details={details} />
                    <Floor title='新鲜水果' floor={recommend.floor2} details={details} />
                    <Floor title='营养奶品' floor={recommend.floor3} details={details} />
                    <HotGoods hotGoodsList={recommend.hotGoods} details={details} />
                </Scroll>
            </div>
            <NavFooter />
        </>
    )
}


export default Home