import React, { memo } from 'react'
import './public.scss'

export default memo(({ goBack, icon, title }) => {
    return (
        <div className='nav-header'>
            {
                icon ?
                    <div className='icon' onClick={goBack}>
                        <i className="fa fa-chevron-left"></i>
                    </div> : ''
            }
            <div className='nav-title' style={{ marginLeft: !icon ? '' : '-10.667vw' }}>{title || 'SIGN IN'}</div>
        </div>
    )
})
