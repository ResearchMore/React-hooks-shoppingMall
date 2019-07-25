import ajax from './axios';

export default {
    register: ajax('/register'),          //注册
    restorePassword: ajax('/resetPassword'), // 修改密码
    login: ajax('/login'),  // 登录
    recommend: ajax('/recommend', 'get'),  // 首页商品查询
    classification: ajax('/classification', 'get'),  // 分类页商品
    goodsDetails: ajax(`/goods/one`, 'get'),      //  获取商品详情
    addShop: ajax(`/addShop`, 'post', false),  // 加入购物车
    getCard: ajax('/getCard'),  // 查询购物车
    editCart: ajax(`/editCart`, 'post', false), // 购物车增加减少
    deleteShop: ajax(`/deleteShop`), // 购物车删除
    isCollection: ajax(`/isCollection`, 'post', false), // 查询商品收藏
    collection: ajax('/collection', 'post', false),// 商品收藏
    cancelCollection: ajax('/cancelCollection', 'post', false),// 商品取消收藏
    getCollectionList: ajax('/collection/list', 'get'),// 查询我的收藏
    setAddress: ajax('/address'),// 保存收货地址
    getAddress: ajax('/getAddress', 'get'),// 查询收货地址
    setDefaultAddress: ajax('/setDefaultAddress'),  // 设置默认收货地址    
    getOneAddress: ajax('/getOneAddress'),  // 查询单条收货地址   
    deleteAddress: ajax('/deleteAddress'),  // 删除单条收货地址   
    getDefaultAddress: ajax('/getDefaultAddress', 'get'),  // 查询默认收货地址   
    placeOrder: ajax('/order'), //提交订单
    getOrderDetils: ajax('/getOrderDetils', 'get'), //查询单条订单
    payOrder: ajax('/payOrder'), //支付订单
    myOrder: ajax('/myOrder','get'), //查询用户订单
    orderNum: ajax('/myOrder/orderNum','get'), //查询用户订单数量
}