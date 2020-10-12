import React, { useState, useEffect } from 'react'
import BrandService from '../../services/layout/brand-service'
import ProductsService from '../../services/layout/products-service'
import { Link } from 'react-router-dom'
import { Spin, message } from 'antd'
import AppHeader from '../../components/layout/header'
import Sidebar from '../../components/layout/sidebar'
import AppFooter from '../../components/layout/footer'
import CartService from '../../services/layout/cart-service'

const BrandDetailPage = () => {
    const [state, setState] = useState({
        brandDetail: null,
        productsList: [],
        loading: true,
        total: 50,
        datacart: [],
        addCart: null
    })
    const idBrand = () => {
        return location.pathname.split('/brand/')[1]?.split('/')[1]
    }

    const dataUser = JSON.parse(localStorage.getItem('dataUser'))
    const dataLogin = JSON.parse(localStorage.getItem('infoUser'))
    const idUser = dataUser?.userId
    const idLogin = dataLogin?.userId

    let brandDetail = { brandName: '' }
    let productsList = []
    let datacart = []
    const fetchData = async () => {
        try {
            brandDetail = await BrandService.detailBrand(idBrand())
            productsList = await ProductsService.getProducts()
            datacart = await CartService.getCart(idUser || idLogin)
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, brandDetail, datacart, productsList, loading: false }))
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
                                <div className='home-page'>
                                    <div className='box-breadcrumb'>
                                        <ul>
                                            <li>
                                                <a href='/'>Trang chủ</a>
                                            </li>
                                            <i className='fas fa-chevron-right'></i>
                                            <li>Thương hiệu</li>
                                            <i className='fas fa-chevron-right'></i>
                                            <li>{state.brandDetail?.brandName}</li>
                                        </ul>
                                    </div>
                                    <div className='detail-brand'>
                                        <div className='des'>
                                            <h1>{state.brandDetail?.brandName}</h1>
                                            <p>{state.brandDetail?.description}</p>
                                        </div>
                                        <div className='img-brand'>
                                            <img
                                                src={`http://localhost:8080/uploads/images/${state.brandDetail?.logo}`}
                                            />
                                        </div>
                                    </div>
                                    {state.productsList?.find(x => x.brandId === state.brandDetail?.brandId) && (
                                        <h4 className='title-detail'>Danh sách sản phẩm</h4>
                                    )}
                                    <div className='just-for-you'>
                                        {state.productsList?.map(product => {
                                            return (
                                                product.brandId === state.brandDetail?.brandId && (
                                                    // eslint-disable-next-line react/jsx-key
                                                    <div className='item-load'>
                                                        <Link
                                                            to={`/product/${product?.productNameToSlug}/${product?.productId}`}>
                                                            <a href='' className='product__item'>
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

export default BrandDetailPage
