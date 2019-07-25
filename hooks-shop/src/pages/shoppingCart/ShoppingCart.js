import React, { useEffect, useCallback } from 'react';
import NavFooter from 'public/NavFooter'
import { NavBar } from 'zarm';
import Scroll from 'public/Scroll'
import NotLogged from 'c/shoppingCart/NotLogged'
import Logged from 'c/shoppingCart/Logged'
import './index.scss'
import * as action from './store/action'
import { connect } from 'react-redux';
const ShoppingCart = ({ list, dispatch }) => {
    const getCard = useCallback(() => {
        dispatch(action.getCard())
    }, [dispatch])

    useEffect(() => {
        getCard()
    }, [getCard])


    return (
        <div>
            <NavBar title="购物车" className='border-bottom' />
            <div className='shopping-cart'>
                <Scroll>
                    {
                        !list.length ? <NotLogged /> : <Logged shopList={list} getCard={getCard} />
                    }
                </Scroll>
            </div>
            <NavFooter active={2} />
        </div>
    )
}

const mapState = state => ({
    list: state.shoppingCart.shopList
})

const mapActions = dispatch => ({
    dispatch
})

export default connect(mapState, mapActions)(ShoppingCart)