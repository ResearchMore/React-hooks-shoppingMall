import React, { memo } from 'react';
const Floor = ({ floor, title,details }) => {
    return (
        <div className='floor'>
            <div className='title'>{title}</div>
            <div className='floor-warpper'>
                <div className='floor-top'>
                    <div onClick={() => details(floor[0].goodsId)} className='floor-top-left border-rightbottom'><img src={floor.length ? floor[0].image : ''} alt='' /></div>
                    <div className='floor-top-right'>
                        <div  onClick={() => details(floor[1].goodsId)}><img src={floor.length ? floor[1].image : ''} alt='' /></div>
                        <div className='border-top' onClick={() => details(floor[2].goodsId)}><img src={floor.length ? floor[2].image : ''} alt='' /></div>
                    </div>
                </div>
                <div className='floor-bottom border-bottom'>
                    <div className='border-right' onClick={() => details(floor[3].goodsId)}><img src={floor.length ? floor[3].image : ''} alt='' /></div>
                    <div className='border-top' onClick={() => details(floor[4].goodsId)}><img src={floor.length ? floor[4].image : ''} alt='' /></div>
                </div>
            </div>
        </div>
    );
}
// class Floor extends Component {
//     state = {}

//     render() {
//         const floor = props.floor
//         return (
//             <div className='floor'>
//                 <div className='title'>{props.title}</div>
//                 <div className='floor-warpper'>
//                     <div className='floor-top'>
//                         <div onClick={() => details(floor.getIn([0, 'goodsId']))} className='floor-top-left border-rightbottom'><img src={floor.size ? floor.getIn([0, 'image']) : ''} alt='' /></div>
//                         <div className='floor-top-right'>
//                             <div className='border-bottom' onClick={() => details(floor.getIn([1, 'goodsId']))}><img src={floor.size ? floor.getIn([1, 'image']) : ''} alt='' /></div>
//                             <div className='border-bottom' onClick={() => details(floor.getIn([2, 'goodsId']))}><img src={floor.size ? floor.getIn([2, 'image']) : ''} alt='' /></div>
//                         </div>
//                     </div>
//                     <div className='floor-bottom border-bottom'>
//                         <div className='border-right' onClick={() => details(floor.getIn([3, 'goodsId']))}><img src={floor.size ? floor.getIn([3, 'image']) : ''} alt='' /></div>
//                         <div onClick={() => details(floor.getIn([4, 'goodsId']))}><img src={floor.size ? floor.getIn([4, 'image']) : ''} alt='' /></div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     details = id => {
//         props.history.push({ pathname: '/details/' + id })
//     }
// }
Floor.defaultProps = {
    floor: [],
    title: ' '
};
export default memo(Floor)