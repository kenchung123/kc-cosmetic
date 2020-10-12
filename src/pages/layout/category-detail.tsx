import React, { useState, useEffect } from 'react'
import ProductsService from '../../services/layout/products-service'
import CategorysService from '../../services/layout/categorys-service'
import { Spin, message } from 'antd'
import AppFooter from '../../components/layout/footer'
import Sidebar from '../../components/layout/sidebar'
import AppHeader from '../../components/layout/header'
import CartService from '../../services/layout/cart-service'
import { Link } from 'react-router-dom'

const CategoryDetailPage = () => {
    const [state, setState] = useState({
        categoryDetail: null,
        productsList: [],
        loading: true,
        datacart: [],
        addCart: null
    })
    const idCategory = () => {
        return location.pathname.split('/category/')[1]?.split('/')[1]
    }

    const dataUser = JSON.parse(localStorage.getItem('dataUser'))
    const dataLogin = JSON.parse(localStorage.getItem('infoUser'))
    const idUser = dataUser?.userId
    const idLogin = dataLogin?.userId

    let categoryDetail = {}
    let productsList = []
    let datacart = []
    const fetchData = async () => {
        try {
            categoryDetail = await CategorysService.detailCategorys(idCategory())
            productsList = await ProductsService.getProducts()
            datacart = await CartService.getCart(idUser || idLogin)
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, categoryDetail, datacart, productsList, loading: false }))
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
    const formatPrice = new Intl.NumberFormat()
    return (
        <body className='sb-nav-fixed'>
            <AppHeader dataCart={state.datacart} />
            <main className='main'>
                <section id='product' className='product'>
                    <div className='grid wide'>
                        <div className='row'>
                            <div className='col-lg-2 hide-on-mobile-tablet'>
                                <Sidebar />
                            </div>
                            <div className='col-lg-10'>
                                <div className='home-page category-detail'>
                                    <div className='box-breadcrumb'>
                                        <ul>
                                            <li>
                                                <a href='/'>Trang chủ</a>
                                            </li>
                                            <i className='fas fa-chevron-right'></i>
                                            <li>{state.categoryDetail?.groupCategoryName}</li>
                                            <i className='fas fa-chevron-right'></i>
                                            <li>{state.categoryDetail?.categoryName}</li>
                                        </ul>
                                    </div>
                                    {state.productsList?.find(
                                        x => x.categoryId === state.categoryDetail?.categoryId
                                    ) && (
                                        <div className='box-title'>
                                            <h2 className='my-title'>
                                                <i className='fab fa-galactic-senate'></i>{' '}
                                                {state.categoryDetail?.categoryName}
                                            </h2>
                                        </div>
                                    )}
                                    <div className='just-for-you'>
                                        {state.productsList?.map(product => {
                                            return (
                                                product.categoryId === state.categoryDetail?.categoryId && (
                                                    // eslint-disable-next-line react/jsx-key
                                                    <div className='item-load'>
                                                        <Link
                                                            to={`/product/${product?.productNameToSlug}/${product?.productId}`}>
                                                            <a href='product-detail.html' className='product__item'>
                                                                <div className='product__image'>
                                                                    <img
                                                                        src={`http://localhost:8080/uploads/images/${product.image}`}
                                                                    />
                                                                </div>
                                                                <div className='product__content'>
                                                                    <div className='product__name'>
                                                                        {product.productName}
                                                                    </div>
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
                                                                    {product.quantity > 0 ? (
                                                                        <button
                                                                            className='btn__cart-badge'
                                                                            onClick={() => addToCart(product)}>
                                                                            <i className='fas fa-cart-plus'></i>
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className='btn__cart-badge'
                                                                            style={{
                                                                                fontSize: '13px',
                                                                                backgroundColor: '#ccc',
                                                                                width: '65px',
                                                                                fontWeight: 600
                                                                            }}>
                                                                            Hết Hàng
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div className='product__favourite'>
                                                                    <i className='fas fa-check'></i>
                                                                    <span>Yêu thích</span>
                                                                </div>
                                                                <div className='product__sale'>
                                                                    <span className='product__sale-percent'>
                                                                        {product.discount} %
                                                                    </span>
                                                                    <span className='product__sale-reduction'>
                                                                        Giảm
                                                                    </span>
                                                                </div>
                                                            </a>
                                                        </Link>
                                                    </div>
                                                )
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <AppFooter />
        </body>
    )
}

export default CategoryDetailPage
