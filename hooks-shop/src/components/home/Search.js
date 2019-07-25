import React, { memo } from 'react'
import './index.scss'
import { SearchBar } from 'zarm'

const Search = ({ goCity }) => {
    return (
        <header>
            <div className='left' onClick={goCity}>{localStorage.getItem('city') || '北京'} ▼</div>
            <div className='right'>
                <div>
                    <SearchBar
                        cancelText='取消'
                        placeholder='搜索'
                        showCancel={false}
                        onSubmit={(value) => {
                            console.log(`搜索内容为${value}`);
                        }}
                        onFocus={() => {
                            console.log('获取焦点');
                        }}
                        onChange={(value) => {
                            console.log(value);
                        }}
                        onBlur={() => {
                            console.log('失去焦点');
                        }}
                        onClear={() => {
                            console.log('点击了清除');
                        }}
                        onCancel={() => {
                            console.log('点击了取消');
                        }}
                    />
                </div>
            </div>
        </header>
    )
}

export default memo(Search)
