import React, { useState, useEffect } from 'react'
import { InputNumber, Spin, message } from 'antd'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import ProductsService from '../../services/layout/products-service'
import AppFooter from '../../components/layout/footer'
import AppHeader from '../../components/layout/header'
import CartService from '../../services/layout/cart-service'
const ProductDetailPage = () => {
    const [state, setState] = useState({
        productDetail: null,
        productsList: [],
        loading: true,
        datacart: [],
        addCart: null
    })
    const idProduct = () => {
        return location.pathname.split('/product/')[1]?.split('/')[1]
    }

    const dataUser = JSON.parse(localStorage.getItem('dataUser'))
    const dataLogin = JSON.parse(localStorage.getItem('infoUser'))
    const idUser = dataUser?.userId
    const idLogin = dataLogin?.userId

    let productDetail = {}
    let productsList = []
    let datacart = []
    const fetchData = async () => {
        try {
            productDetail = await ProductsService.detailProducts(idProduct())
            productsList = await ProductsService.getProducts()
            datacart = await CartService.getCart(idUser || idLogin)
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, productDetail, datacart, productsList, loading: false }))
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

    const settings = {
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
                        <div className='product-detail'>
                            <div className='box-breadcrumb'>
                                <ul>
                                    <li>
                                        <a href='/'>Trang chủ</a>
                                    </li>
                                    <i className='fas fa-chevron-right'></i>
                                    <li>Sản phẩm</li>
                                    <i className='fas fa-chevron-right'></i>
                                    <li>{state.productDetail?.productName}</li>
                                </ul>
                            </div>
                            <div className='box-detail'>
                                <div className='box-img'>
                                    <img src={`http://localhost:8080/uploads/images/${state.productDetail?.image}`} />
                                </div>
                                <div className='box-des'>
                                    <h4>{state.productDetail?.productName}</h4>
                                    <div className='product__detail-price'>
                                        <del>{formatPrice.format(state.productDetail?.price)} đ</del>
                                        <ins>{formatPrice.format(state.productDetail?.priceSale)} đ</ins>
                                    </div>
                                    <div className='product__detail-brief'>
                                        <span className='product__detail-brief-label'>Thông tin</span>
                                        <p className='product__detail-brief-infor'>
                                            {state.productDetail?.productInfo}
                                        </p>
                                    </div>
                                    <div className='product__detail-quantity'>
                                        <span>Số lượng</span>
                                        <div>
                                            <InputNumber min={1} max={100} defaultValue={1} />
                                        </div>
                                    </div>
                                    <div className='product__detail-cart'>
                                        {state.productDetail?.quantity > 0 ? (
                                            <button
                                                className='product__detail-cart-btn product__detail-cart-btn--cart'
                                                onClick={() => addToCart(state.productDetail)}>
                                                <i className='fas fa-cart-plus'></i> Thêm vào giỏ hàng
                                            </button>
                                        ) : (
                                            <button
                                                className='product__detail-cart-btn product__detail-cart-btn--cart'
                                                style={{
                                                    backgroundColor: '#ccc'
                                                }}>
                                                <i className='fas fa-cart-plus'></i> Hết Hàng
                                            </button>
                                        )}
                                        <button className='product__detail-cart-btn'>Mua ngay</button>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-des'>
                                <div className='detail'>chi tiết sản phẩm</div>
                                <div>
                                    <span className='brand-name'>Thương hiệu</span>
                                    <span>{state.productDetail?.brandName}</span>
                                </div>
                                <div className='detail'>mô tả sản phẩm</div>
                                <span className='des-product'>{state.productDetail?.productDescription}</span>
                            </div>
                            <h4 className='title-detail'>CÁC SẢN PHẨM KHÁC CỦA SHOP</h4>
                            <Slider {...settings}>
                                {state.productsList?.map(product => {
                                    return (
                                        // eslint-disable-next-line react/jsx-key
                                        <div>
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
                            </Slider>
                            <h4 className='title-detail'>sản phẩm tương tự</h4>
                            <Slider {...settings}>
                                {state.productsList?.map(product => {
                                    return (
                                        // eslint-disable-next-line react/jsx-key
                                        <div>
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
                                                                {formatPrice.format(product.price)}
                                                            </del>
                                                            <ins className='product__price-new'>
                                                                {formatPrice.format(product.priceSale)}
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
                                                        <button
                                                            className='btn__cart-badge'
                                                            onClick={() => addToCart(state.productDetail)}>
                                                            <i className='fas fa-cart-plus'></i>
                                                        </button>
                                                    </div>
                                                    <div className='product__favourite'>
                                                        <i className='fas fa-check'></i>
                                                        <span>Yêu thích</span>
                                                    </div>
                                                    <div className='product__sale'>
                                                        <span className='product__sale-percent'>
                                                            {product.discount}
                                                        </span>
                                                        <span className='product__sale-reduction'>Giảm</span>
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </Slider>
                        </div>
                    </div>
                </section>
            </main>
            <AppFooter />
        </body>
    )
}

export default ProductDetailPage
