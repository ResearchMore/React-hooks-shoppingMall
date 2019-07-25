import React, { useState, useRef, useEffect, useCallback } from 'react';
import './index.scss'
import { SearchBar } from 'zarm'
import NavHeader from 'public/NavHeader'
import Scroll from 'public/Scroll'
import cityList from 'js/city'

export default ({ history }) => {
    let [citys] = useState(cityList)
    let [fixedTitle] = useState('当前城市')
    let [searchList, setSearchList] = useState([])// 搜索出来的城市
    let [defaultValue, setDefaultValue] = useState('')// 搜索出来的城市
    let scroll = useRef()
    let heightArr = []      // 每个省份城市区间的高度
    let listFixed = useRef()
    let listTitle = useRef()
    let touchStatus = false // 时候开始点击

    const changeSearch = e => {
        searchCity(e)
        scroll.current.scrollTo(0, 0, 0)    // 调用子组件方法
    }

    const onCancel = useCallback(() => {
        if (defaultValue) {
            setSearchList([])
            setDefaultValue('')
            setTimeout(() => {
                scroll.current.scrollTo(0, 0, 0)    // 调用子组件方法
            }, 20);
        }
    }, [defaultValue])

    // 选择城市
    const cityOk = useCallback(name => {
        localStorage.setItem('city', name)
        setTimeout(() => {
            history.push('/')
        }, 10);
    }, [history])
    // 城市搜索
    const searchCity = useCallback((e) => {
        let arr = [];
        for (const k in citys.data.cities) {
            citys.data.cities[k].forEach(item => {
                if (item.spell.includes(e) || item.name.includes(e)) {
                    arr.push(item);
                }
            });
        }
        setSearchList(arr)
        setDefaultValue(e)
    }, [citys.data.cities])

    const goBack = useCallback(() => {
        history.push('/')
    }, [history])

    // 获取高度
    const listHeight = useCallback(() => {
        if (defaultValue) {
            return
        }
        const currentAreaHeight = document.getElementById('current-area').clientHeight  // 当前城市高度

        const hotCityHeight = document.getElementById('hot-city').clientHeight  // 热门城市高度
        let oldHeight = currentAreaHeight + hotCityHeight   // 两个区域高度
        heightArr.push(oldHeight)
        const areaHeight = Array.from(document.querySelectorAll('.area2'))  // 获取每一个字母下面城市的，然后分别获取每一个高度
        areaHeight.forEach(item => {
            oldHeight += item.clientHeight
            heightArr.push(oldHeight);
        })
    }, [defaultValue, heightArr])

    // 获取坐标
    const onScroll = e => {
        const scrollY = e.y
        if (scrollY > 0) {
            listTitle.current.innerText = ''
            listFixed.current.style.display = 'none'
        }
        let heightArr1 = heightArr
        if (!heightArr1 || !heightArr.length) {
            return
        }
        let letterArr = letter()
        for (let i = 0; i < heightArr1.length; i++) {
            let height1 = heightArr1[i];
            let height2 = heightArr1[i + 1];
            if (-scrollY >= height1 && -scrollY < height2) {
                if (letterArr[i]) {
                    listTitle.current.innerText = letterArr[i]
                    listFixed.current.style.display = 'block'
                    diff(height2 + scrollY)
                }
                return;
            } else {
                if (listFixed.current) {
                    listFixed.current.style.display = 'none'
                }
            }
        }
    }

    const diff = useCallback(newY => {
        if (listFixed) {
            let fixedTop = newY > 0 && newY < 30 ? newY - 30 : 0;
            listFixed.current.style.transform = `translate3d(0,${fixedTop}px,0)`;
        }
    }, [])

    const letter = useCallback(() => {
        let arr = [];
        for (let k in citys.data.cities) {
            arr.push(k);
        }
        return arr;
    }, [citys.data.cities])

    // 按字母选择城市
    const selectCity = useCallback((e, index) => {
        scroll.current.scrollTo(0, -heightArr[index], 0)    // 调用子组件方法
    }, [heightArr])

    const hiddleTouchstat = (e) => {
        e.persist()
        touchStatus = true;
    }

    const hiddleTouchmove = useCallback((e) => {
        if (!touchStatus) {
            return
        }
        const eleArr = Array.from(document.querySelectorAll('.city-letter'))    // 获取全部字母的元素
        const startY = eleArr[0].offsetTop; //A 距离顶部的高度
        const eleOffsetTop = document.getElementById('ul-list').offsetTop    // 动态获取ul距离顶部的宽高
        const clientY = eleArr[0].offsetHeight // 动态获取每一个li到宽高
        const touchY = e.touches[0].clientY - eleOffsetTop;
        const inx = Math.floor((touchY - startY) / clientY); //当前手指滑动的位置    
        if (inx >= 0 && heightArr[inx] && letter()[inx]) {
            scroll.current.scrollTo(0, -heightArr[inx], 200)    // 调用子组件方法
        }
    }, [heightArr, letter, touchStatus])

    const hiddleTouchend = () => {
        touchStatus = false
    }

    useEffect(() => {
        listHeight()
    })

    return (
        <div className='city-warp'>
            <div className='border-bottom'><NavHeader goBack={goBack} icon={true} title='城市选择' /></div>
            <SearchBar shape="round" onCancel={onCancel} onChange={e => changeSearch(e)} placeholder='输入城市拼音或关键字' cancelText='取消' />
            <div className='city'>
                {/* 搜索城市相关展示 */}
                {
                    defaultValue ?
                        <Scroll onScroll={() => console.log()}>
                            {
                                searchList.map(item => {
                                    return (
                                        <div className="item-list" key={item.id} onClick={() => cityOk(item.name)}>
                                            <div className="item border-bottom">{item.name}</div>
                                        </div>
                                    )
                                })
                            }

                        </Scroll> :
                        <Scroll isToelement={true} ref={scroll} onScroll={onScroll} listenScroll={true} probeType={3}>
                            <div className="area" id='current-area'>
                                <div className="titles">当前城市</div>
                                <div className="button-list">
                                    <div className="button-warpper">
                                        <div className="button">百色</div>
                                    </div>
                                </div>
                            </div>
                            <div className="area" id='hot-city'>
                                <div className="titles">热门城市</div>
                                <div className="button-list">
                                    {
                                        citys.data.hotCities.map(item => {
                                            return (
                                                <div className="button-warpper" key={item.id} onClick={() => cityOk(item.name)}>
                                                    <div className="button">{item.name}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            {
                                Object.keys(citys.data.cities).map((key) => {
                                    return (
                                        <div className="area2" key={key}>
                                            <div className="titles border-topbottom">{key}</div>
                                            {
                                                citys.data.cities[key].map(item => {
                                                    return (
                                                        <div className="item-list" key={item.id} onClick={() => cityOk(item.name)}>
                                                            <div className="item border-bottom" >{item.name}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </Scroll>
                }

                <div id='list-fixed' ref={listFixed}>
                    <div id='fixed-title' ref={listTitle}>{fixedTitle}</div>
                </div>:''

                </div>
            {/* 右边字母排序 */}
            {
                !defaultValue ?
                    <ul id='ul-list'>
                        {
                            Object.keys(citys.data.cities).map((key, index) => {
                                return (
                                    <li className='city-letter' key={key} onClick={(e) => selectCity(e, index)} onTouchStart={hiddleTouchstat} onTouchMove={hiddleTouchmove} onTouchEnd={hiddleTouchend}>{key}</li>
                                )
                            })
                        }
                    </ul> : ''
            }
        </div >
    )
}

