import React, { memo } from 'react';
import { Tabs } from 'zarm';
const { Panel } = Tabs;
const GoodsTabs = ({ detail }) => {
    return (
        <div>
            <Tabs onChange={(i) => { console.log(i); }} lineWidth={80}>
                <Panel title="商品详情">
                    <div className="contenta" dangerouslySetInnerHTML={{ __html: detail }}></div>
                </Panel>
                <Panel title="商品评论">
                    <div className="contenta-left">商品评论</div>
                </Panel>
            </Tabs>
        </div>
    )
}

export default memo(GoodsTabs)