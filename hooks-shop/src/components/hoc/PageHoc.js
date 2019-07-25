import React, { Component } from 'react';

const PageHoc = WrappedComponent => {
    return class extends Component {
        state = {
            dataArr: [],
            total: null,
            loading: false, // 锁
        }

        render() {
            const props = {
                ...this.props,
                dataArr: this.state.dataArr,
                total: this.state.total,
                loading: this.state.loading,
                setNewData: this.setNewData,
                getCurrentStart: this.getCurrentStart,
                hasMore: this.hasMore,
                setTotal: this.setTotal,
                isLocked: this.isLocked,
                locked: this.locked,
                unLocked: this.unLocked,
                clearArr: this.clearArr
            }
            return <WrappedComponent {...props} />
        }

        // newArr, 第二页请求到的数据
        setNewData = (newArr) => {
            
            this.setState(prev => ({
                dataArr: [...prev.dataArr, ...newArr]
            }))
        }

        // 起始的记录数
        getCurrentStart = () => {
            return this.state.dataArr.length
        }

        // 是否还有更多数据加载
        hasMore = () => {
            // 说明没有数据要加载了
            if (this.state.dataArr.length >= this.state.total) {
                return false
            }
            return true
        }

        // 总条数
        setTotal = (total) => {
            this.setState(prev => ({
                total
            }))
        }

        // 清空数组
        clearArr = () => {
            this.setState({
                dataArr: [],
                total: null
            })
        }

        // 锁的机制
        isLocked = () => {
            return this.state.loading ? true : false
        }

        // 加锁
        locked = () => {
            this.setState(prev => ({
                loading: true
            }))
        }

        unLocked = () => {
            this.setState(prev => ({
                loading: false
            }))
        }
    }
}
export default PageHoc;