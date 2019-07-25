import React, { lazy, Suspense } from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
const App = lazy(() => import('./App'))
const Home = lazy(() => import('pages/home'))   // 首页
const Category = lazy(() => import('pages/category')) // 分类
const My = lazy(() => import('pages/my'))        // 个人中心
const Details = lazy(() => import('pages/details')) // 商品详情
const ShoppingCart = lazy(() => import('pages/shoppingCart/ShoppingCart')) // 购物车
const City = lazy(() => import('pages/city'))   // 城市选择
const PayMent = lazy(() => import('pages/shoppingCart/PayMent'))    // 支付
const AddressEdit = lazy(() => import('pages/address/AddressEdit')) // 地址编辑
const AddressList = lazy(() => import('pages/address/AddressList'))// 地址列表
const Collection = lazy(() => import('pages/collection')) //  我的收藏
const Browse = lazy(() => import('pages/browse')) //  最近浏览
const Order = lazy(() => import('pages/order')) //  订单
const PayOk = lazy(() => import('pages/shoppingCart/PayOk')) //  订单


const pages = [
    { path: "/home", name: "Home", component: Home, },
    { path: "/category", name: "Category", component: Category, },
    { path: "/my", name: "My", component: My, },
    { path: "/details/:id", name: "Details", component: Details, },
    { path: "/shoppingCart", name: "ShoppingCart", component: ShoppingCart, },
    { path: "/city", name: "City", component: City, },
    { path: "/payMent", name: "PayMent", component: PayMent, },
    { path: "/addressEdit/:id", name: "AddressEdit", component: AddressEdit, },
    { path: "/addressList", name: "AddressList", component: AddressList, },
    { path: "/collection", name: "Collection", component: Collection, },
    { path: "/browse", name: "Browse", component: Browse, },
    { path: "/order/:id", name: "Order", component: Order },
    { path: "/payOk/:id", name: "PayOk", component: PayOk },
    { path: "/", name: "Home", component: Home, },
]

export default () => {
    return (
        <Suspense fallback={null}>
            <HashRouter>
                <App>
                    <Switch>
                        <Route path="/" render={() =>
                            <Switch>
                                {
                                    pages.map((item, index) => <Route key={index} path={item.path} render={props => route(item, props)} />)
                                }
                            </Switch>
                        } />
                    </Switch>
                </App>
            </HashRouter>
        </Suspense>

    )
}


function route(item, props) {
    const token = localStorage.getItem('token')
    if (item.noAuth === true && token) {
        // 如果已经登录了，就不能进入登录相关页面
        return <Redirect to={{ pathname: '/home', state: { from: props.location } }} />
    } else {
        if (item.auth === true && !token) {
            // 一些页面需要登录
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        } else {
            return <item.component {...props} />
        }
    }
}