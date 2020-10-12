import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import product2 from '../../static/layout/images/sp2.jpg'
import banner1 from '../../static/layout/images/slider1.jpg'
import banner2 from '../../static/layout/images/slider2.jpg'
import banner3 from '../../static/layout/images/slider3.jpg'
import banner4 from '../../static/layout/images/slider4.jpg'
import banner5 from '../../static/layout/images/slider5.jpg'
import { Link } from 'react-router-dom'
import GroupcategorysService from '../../services/layout/groupcategorys-service'
import BrandService from '../../services/layout/brand-service'
import ProductsService from '../../services/layout/products-service'
import { Spin, message } from 'antd'
import CartService from '../../services/layout/cart-service'
import AppHeader from '../../components/layout/header'
import AppFooter from '../../components/layout/footer'
import Sidebar from '../../components/layout/sidebar'

export interface HomeProps {
    dataCart?: any
}
const HomePage = () => {
    const [state, setState] = useState({
        groupcategorysList: [],
        brandList: [],
        productsList: [],
        datacart: [],
        limit: 10,
        loading: true,
        addCart: null
    })

    const dataUser = JSON.parse(localStorage.getItem('dataUser'))
    const dataLogin = JSON.parse(localStorage.getItem('infoUser'))
    const idUser = dataUser?.userId
    const idLogin = dataLogin?.userId
    let groupcategorysList = []
    let brandList = []
    let productsList = []
    let datacart = []
    const fetchData = async () => {
        try {
            groupcategorysList = await GroupcategorysService.getGroupcategorys()
            brandList = await BrandService.getBrand()
            productsList = await ProductsService.getProducts()
            datacart = await CartService.getCart(idUser || idLogin)
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, groupcategorysList, brandList, productsList, datacart, loading: false }))
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

    const reLoad = () => {
        setTimeout(() => {
            window.location.reload()
        }, 500)
    }

    const settings2 = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    }

    const loadMore = () => {
        setState(s => ({ ...s, limit: state.limit + 10 }))
    }

    let addCart = null
    const addToCart = async dataProduct => {
        const { datacart } = state
        try {
            addCart = await CartService.addCart(dataProduct.productId, 1)
            console.log(addCart.data, 'addCart.data')
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
    console.log(state.datacart, 'home')
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
                                <Slider {...settings} className='slide-banner'>
                                    <div>
                                        <img src={banner1} />
                                    </div>
                                    <div>
                                        <img src={banner2} />
                                    </div>
                                    <div>
                                        <img src={banner3} />
                                    </div>
                                    <div>
                                        <img src={banner4} />
                                    </div>
                                    <div>
                                        <img src={banner5} />
                                    </div>
                                </Slider>
                            </div>
                        </div>
                        <div className='box-title'>
                            <h2 className='my-title'>
                                <i className='fas fa-award'></i> Thương hiệu nổi tiếng
                            </h2>
                        </div>
                        <Slider {...settings2} className='slider-brand'>
                            {state.brandList.map(brand => {
                                return (
                                    // eslint-disable-next-line react/jsx-key
                                    <div className='item-brand'>
                                        <Link
                                            to={`/brand/${brand.brandName}/${brand.brandId}`}
                                            onClick={() => reLoad()}>
                                            <img src={`http://localhost:8080/uploads/images/${brand.logo}`} />
                                        </Link>
                                    </div>
                                )
                            })}
                        </Slider>
                        <div className='box-title'>
                            <h2 className='my-title'>
                                <i className='far fa-star'></i> Top bán chạy
                            </h2>
                        </div>
                        <Slider {...settings2}>
                            {state.productsList?.map((product, index) => {
                                return (
                                    // eslint-disable-next-line react/jsx-key
                                    <div key={index}>
                                        <div className='product__item'>
                                            <Link to={`/product/${product?.productNameToSlug}/${product?.productId}`}>
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
                                            </Link>
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
                                                <span className='product__sale-percent'>{product.discount} %</span>
                                                <span className='product__sale-reduction'>Giảm</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </Slider>
                        <div className='box-title' style={{ marginTop: '-40px' }}>
                            <h2 className='my-title'>
                                <i className='far fa-plus-square'></i> Sản phẩm mới
                            </h2>
                        </div>
                        <Slider {...settings2}>
                            {state.productsList?.map((product, index) => {
                                return (
                                    // eslint-disable-next-line react/jsx-key
                                    <div key={index}>
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
                                                    <span className='product__sale-percent'>{product.discount} %</span>
                                                    <span className='product__sale-reduction'>Giảm</span>
                                                </div>
                                            </a>
                                        </Link>
                                    </div>
                                )
                            })}
                        </Slider>
                        <div className='box-title' style={{ marginTop: '-40px' }}>
                            <h2 className='my-title'>
                                <i className='fab fa-artstation'></i> Dành riêng cho bạn
                            </h2>
                        </div>
                        <div className='just-for-you'>
                            {state.productsList?.slice(0, state.limit)?.map(product => {
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
                                                    <span className='product__sale-percent'>{product.discount} %</span>
                                                    <span className='product__sale-reduction'>Giảm</span>
                                                </div>
                                            </a>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                        {state.limit < state.productsList.length && (
                            <div className='load-more' onClick={() => loadMore()}>
                                <span>Xem thêm</span>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <AppFooter />
        </body>
    )
}

export default HomePage
