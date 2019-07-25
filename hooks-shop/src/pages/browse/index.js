import React, { useCallback, useState } from 'react';
import Scroll from 'public/Scroll'
import GoodsItem from 'public/GoodsItem'
import { Confirm } from 'zarm';
import { recentlyBrowse } from 'js/cache'
import './index.scss'
import NavHeader from 'public/NavHeader'

const Browse = ({ history }) => {
    let [confirm, setConfirm] = useState(false)
    let [list, setList] = useState(recentlyBrowse.getBrowse())

    const goBack = useCallback(() => {
        history.push('/my')
    }, [history])

    const deleteItem = useCallback(id => {
        recentlyBrowse.deleteOne(id)
        setList(recentlyBrowse.getBrowse())
    }, [])

    const clear = useCallback(() => {
        recentlyBrowse.clearBrowse()
        setConfirm(false)
        setList(recentlyBrowse.getBrowse())
    }, [])

    return (
        <div>
            <div className='border-bottom'>
                <div className='browse-header'>
                    <NavHeader goBack={goBack} icon={true} title='最近浏览' />
                    {recentlyBrowse.getBrowse().length ? <span onClick={() => setConfirm(true)}>清空</span> : ''}
                </div>
                <div className='browse'>
                    <Scroll>
                        {
                            list.map(item => {
                                return <GoodsItem isCollection={true} key={item._id} goodsItem={item} deleteItem={() => deleteItem(item.id)} />
                            })
                        }
                    </Scroll>
                </div>
            </div>
            {
                !recentlyBrowse.getBrowse().length ? <div className='no-data'>暂无最近浏览~~</div> : null
            }
            <Confirm
                shape="radius"
                visible={confirm}
                title="确认信息"
                message="你确定清空吗？"
                onOk={clear}
                onCancel={() => setConfirm(false)}
            />
        </div>
    )
}
export default Browse