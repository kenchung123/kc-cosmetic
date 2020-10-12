import React, { useState, useEffect } from 'react'
import { Spin, message, Select } from 'antd'
import AppHeader from '../../components/layout/header'
import AppFooter from '../../components/layout/footer'
import CartService from '../../services/layout/cart-service'
import { Link } from 'react-router-dom'

const FindProductPage = () => {
    const [state, setState] = useState({
        loading: true,
        datacart: [],
        findProduct: []
    })
    const { Option } = Select

    const dataUser = JSON.parse(localStorage.getItem('dataUser'))
    const dataLogin = JSON.parse(localStorage.getItem('infoUser'))
    const idUser = dataUser?.userId
    const idLogin = dataLogin?.userId

    let datacart = []
    let findProduct = []
    const fetchData = async () => {
        try {
            datacart = await CartService.getCart(idUser || idLogin)
            findProduct = JSON.parse(localStorage.getItem('dataSearch'))
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, datacart, findProduct, loading: false }))
    }

    useEffect(() => {
        if (state.loading) {
            fetchData()
        }
    }, [])

    if (state.loading) {
        return <Spin />
    }
    localStorage.removeItem('status')

    // add to cart
    let addCart = null
    const addToCart = async dataProduct => {
        const { datacart } = state
        try {
            addCart = await CartService.addCart(dataProduct.productId, 1)
            if (addCart.status === 200) {
                datacart.push(addCart.data)
                message.success('Sản phẩm đã được thêm vào giỏ hàng')
                setState(s => ({ ...s, datacart }))
            }
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, addCart: addCart, datacart }))
    }

    localStorage.removeItem('status')

    const formatPrice = new Intl.NumberFormat()
    return (
        <body className='sb-nav-fixed'>
            <AppHeader dataCart={state.datacart} />
            <main className='main'>
                <section id='product' className='product'>
                    <div className='grid wide'>
                        <div className='home-page'>
                            <h4 className='key-search'>
                                <i className='fab fa-searchengin'></i> {state.findProduct?.length} kết quả tìm kiếm
                            </h4>
                            <div className='just-for-you'>
                                {state.findProduct?.map(product => {
                                    return (
                                        // eslint-disable-next-line react/jsx-key
                                        <div className='item-load'>
                                            <Link to={`/product/${product?.productNameToSlug}/${product?.productId}`}>
                                                <a href='product-detail.html' className='product__item'>
                                                    <div className='product__image'>
                                                        <img
                                                            src={`http://localhost:8080/uploads/images/${product.image}`}
                                                        />
                                                    </div>
                                                    <div className='product__content'>
                                                        <div className='product__name'>{product.productName}</div>
                                                        <div className='product__price'>
                                                            <del className='product__price-del'>
                                                                {formatPrice.format(product.price)} đ
                                                            </del>
                                                            <ins className='product__price-new'>
                                                                {formatPrice.format(product.priceSale)} đ
                                                            </ins>
                                                        </div>
                                                        <div className='product__heart'>
                                                            <span>
                                                                <i className='far fa-heart'></i>
                                                            </span>
                                                            <div className='product__header-star'>
                                                                <i className='fas fa-star' />
                                                                <i className='fas fa-star' />
                                                                <i className='fas fa-star' />
                                                                <i className='fas fa-star' />
                                                                <i className='fas fa-star' />
                                                            </div>
                                                        </div>
                                                        <div className='product__nation'>
                                                            <span>{product.brandName}</span>
                                                            <span>Hàn Quốc</span>
                                                        </div>
                                                    </div>
                                                    <div className='btn__cart-inner'>
                                                        <button className='btn__cart-badge'>
                                                            <i className='fas fa-cart-plus'></i>
                                                        </button>
                                                    </div>
                                                    <div className='product__favourite'>
                                                        <i className='fas fa-check'></i>
                                                        <span>Yêu thích</span>
                                                    </div>
                                                    <div className='product__sale'>
                                                        <span className='product__sale-percent'>
                                                            {product.discount} %
                                                        </span>
                                                        <span className='product__sale-reduction'>Giảm</span>
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <AppFooter />
        </body>
    )
}

export default FindProductPage
