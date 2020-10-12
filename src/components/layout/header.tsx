import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Input, Spin, Button, Form, message } from 'antd'
import logo from '../../static/layout/images/logo3.png'
import ProductsService from '../../services/layout/products-service'
import CartService from '../../services/layout/cart-service'
import cartEmpty from '../../static/layout/images/cart-empty.png'
export interface HeaderProps {
    dataCart?: any
}
const AppHeader = (props: HeaderProps) => {
    const [form] = Form.useForm()
    const [state, setState] = useState({
        productsList: [],
        loading: true,
        keySearch: '',
        dataProduct: [],
        datacart: [],
        deleteCart: {},
        dataSearch: [],
        suggestSearch: []
    })

    const dataUser = JSON.parse(localStorage.getItem('dataUser'))
    const dataLogin = JSON.parse(localStorage.getItem('infoUser'))
    const idUser = dataUser?.userId
    const idLogin = dataLogin?.userId

    let productsList = []
    let datacart = []
    const fetchData = async () => {
        try {
            productsList = await ProductsService.getProducts()
            datacart = props.dataCart || (await CartService.getCart(idUser || idLogin))
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, productsList, datacart, loading: false }))
    }

    const udQuantity = []
    state.datacart?.map(cart => {
        udQuantity.push(cart.quantity)
    })
    const reducer = (accumulator, currentValue) => accumulator + currentValue
    const quantityCart = udQuantity.reduce(reducer, 0)
    useEffect(() => {
        if (state.loading) {
            fetchData()
        }
    }, [])

    useEffect(() => {
        form.setFieldsValue({
            keySearch: state.keySearch
        })
    }, [state])

    if (state.loading) {
        return <Spin />
    }

    const menu = (
        <Menu>
            <Menu.Item key='0'>
                <Link to='/profile' onClick={() => reLoad()}>
                    Thông tin tài khoản
                </Link>
            </Menu.Item>
            <Menu.Item key='1'>
                <Link to='/order' onClick={() => reLoad()}>
                    Đơn mua
                </Link>
            </Menu.Item>
            <Menu.Item key='1'>
                <Link to='/login' onClick={() => loadPage()}>
                    Đăng xuất
                </Link>
            </Menu.Item>
        </Menu>
    )

    const reLoad = () => {
        setTimeout(() => {
            window.location.reload()
        }, 500)
    }

    const loadPage = () => {
        localStorage.removeItem('infoUser')
        setTimeout(() => {
            window.location.reload()
        }, 500)
    }

    let suggestSearch = []
    const handleSearch = async event => {
        if (event.target.value) {
            const keySearch = event.target.value
            suggestSearch = await ProductsService.findProduct(keySearch)
            setState(s => ({ ...s, keySearch, suggestSearch }))
        } else setState(s => ({ ...s, keySearch: '' }))
    }

    const changeText = async () => {
        const { keySearch } = state
        if (keySearch) {
            const dataSearch = await ProductsService.findProduct(keySearch)
            setState(s => ({ ...s, dataSearch: dataSearch, keySearch }))
            localStorage.setItem('dataSearch', JSON.stringify(dataSearch))
            window.location.href = `/search?keySearch=${keySearch}`
        } else {
            window.location.href = '/'
        }
    }

    const deleteCart = async id => {
        try {
            const deleteCart = await CartService.deleteCart(id)
            if (deleteCart.status === 200) {
                message.success('Xóa sản phẩm thành công')
            }
        } catch (error) {
            console.log('error')
        }
        setState(s => ({
            ...s,
            deleteCart: deleteCart.data,
            datacart: state.datacart.filter(cart => cart.cartId !== id)
        }))
    }

    const textSearch = name => {
        state.keySearch = name
        setState(s => ({ ...s, keySearch: name }))
        document.getElementById('suggest-search').style.display = 'none'
    }
    localStorage.setItem('search', state.keySearch)
    // console.log(document.body.scrollHeight, 'document.body.scrollHeight')
    if (document.body.scrollHeight === 100) {
        // console.log('vooo')
    }
    const formatPrice = new Intl.NumberFormat()
    return (
        <Fragment>
            <header className='header'>
                <div className='grid wide'>
                    <nav className='header__navbar hide-on-mobile-tablet'>
                        <ul className='header__list'>
                            <li className='header__list-item'>
                                <a
                                    href='#'
                                    className='header__list-link header__list-link--border header__list-item--padding'>
                                    kccosmetic@gmail.com
                                </a>
                            </li>
                            <li className='header__list-item header__list-link--hover'>
                                <a href='#' className='header__list-link header__list-link--border'>
                                    0377685999
                                </a>
                                <div className='header__qr'>
                                    <a className='header__qr-link'>
                                        <img src='./images/qr-code.png' alt='' className='header__qr-image' />
                                        <div className='qr__apps'>
                                            <img
                                                src='./images/google-store.png'
                                                alt=''
                                                className='header__qr-image-item'
                                            />
                                            <img
                                                src='./images/app-store.png'
                                                alt=''
                                                className='header__qr-image-item'
                                            />
                                        </div>
                                    </a>
                                </div>
                            </li>
                            <li className='header__list-item'>
                                <a href='#' className='header__list-link header__list-link--default'>
                                    Kết nối
                                </a>
                            </li>
                            <li className='header__list-item'>
                                <a href='#' className='header__list-link header__list-icon--facebook'>
                                    <i className='fab fa-facebook header__list-icon' />
                                </a>
                            </li>
                            <li className='header__list-item'>
                                <a href='#' className='header__list-link header__list-icon--facebook'>
                                    <i className='fab fa-instagram header__list-icon' />
                                </a>
                            </li>
                        </ul>
                        <ul className='header__list'>
                            <li className='header__list-item header__list-link--notify'>
                                <a href='#' className='header__list-link'>
                                    <i className='far fa-bell'></i>
                                    Thông Báo
                                </a>
                                <div className='header__notify header__notify-height header__notify--cart'>
                                    <div className='header__notify-item'>
                                        <img src='./images/notify.png' alt='' className='header__notify-image' />
                                        <p className='header__notify-text'>Đăng nhập để xem Thông báo</p>
                                    </div>
                                    <div className='header__notify-form'>
                                        <a className='header__notify-btn header__notify-btn--register'>Đăng ký</a>
                                        <a className='header__notify-btn header__notify-btn--login'>Đăng nhập</a>
                                    </div>
                                </div>
                            </li>
                            <li className='header__list-item'>
                                <a href='#' className='header__list-link'>
                                    <i className='far fa-question-circle'></i>
                                    Trợ Giúp
                                </a>
                            </li>
                            {dataUser || dataLogin ? (
                                <li className='header__list-item'>
                                    <Dropdown overlay={menu}>
                                        <a href='/register' className='header__list-link header__list-link--border'>
                                            Chào, {dataUser?.fullName || dataLogin?.fullName}
                                        </a>
                                    </Dropdown>
                                </li>
                            ) : (
                                <li className='header__list-item'>
                                    <a href='/register' className='header__list-link header__list-link--border'>
                                        Đăng Ký
                                    </a>
                                </li>
                            )}
                            {dataUser === null && dataLogin === null ? (
                                <li className='header__list-item'>
                                    <a href='/login' className='header__list-link header__list-item--margin'>
                                        Đăng Nhập
                                    </a>
                                </li>
                            ) : (
                                ''
                            )}
                        </ul>
                    </nav>
                    <div className='menu__siderbar'>
                        <label className='header__icon-bars' htmlFor='nav__input'>
                            <i className='fal fa-bars' />
                        </label>
                        <label className='header__icon-bars header__icon-bars--search' htmlFor='nav__search'>
                            <i className='fal fa-search' />
                        </label>
                        <input type='checkbox' hidden id='nav__input' className='nav__input' />
                        <label htmlFor='nav__input' className='navbar__overlay' />
                        <nav className='navbar__mobile-wrapper'>
                            <div className='navbar__mobile-list'>
                                <a className='navbar__mobile-link navbar__mobile-link--active'>Tất cả sản phẩm</a>
                            </div>
                            <ul className='navbar__mobile-list'>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Ohui Thefirst Tái Sinh</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Ohui Dưỡng Trắng</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Ohui Prime Advancer</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Ohui Dưỡng Ẩm</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Ohui Chống Lão Hóa</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Ohui Make Up</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Ohui Chống Nắng</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Whoo Bichup</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Whoo Dưỡng Ẩm</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Whoo Dưỡng Trắng Trị Nám</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Whoo Make Up</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Whoo Tái Sinh</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Whoo Chống Nắng</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Whoo Spa</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Whoo Chống Lão Hóa</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Whoo Hoàn Lưu Cao</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Su:m37 Tái Sinh</a>
                                </li>
                                <li className='navbar__mobile-item'>
                                    <a className='navbar__mobile-link'>Sm:m37 Chống Lão Hóa</a>
                                </li>
                            </ul>
                        </nav>
                        <div className='header__logo'>
                            <a href='/'>
                                <img src={logo} />
                            </a>
                        </div>
                        <input type='checkbox' hidden id='nav__search' className='nav__search' />
                        <div className='form__search'>
                            <form method='POST'>
                                <Form form={form} initialValues={{ keySearch: state.keySearch }}>
                                    <Input
                                        placeholder='Tìm sản phẩm, thương hiệu...'
                                        onChange={handleSearch}
                                        value={state.keySearch}></Input>
                                    {state.keySearch && (
                                        <ul id='suggest-search'>
                                            {state.suggestSearch.map(item => {
                                                return (
                                                    // eslint-disable-next-line react/jsx-key
                                                    <li onClick={() => textSearch(item.productName || item.brandName)}>
                                                        {item.productName || item.brandName}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    )}
                                    <Button onClick={() => changeText()}>Tìm kiếm</Button>
                                </Form>
                                <div className='form__search-history'>
                                    <span className='form__search-history-label'>Lịch sử tìm kiếm</span>
                                    <div className='form__search-history-list'>
                                        <div className='form__search-history-item'>
                                            <a className='form__search-history-link'>Điện thoại</a>
                                        </div>
                                        <div className='form__search-history-item'>
                                            <a className='form__search-history-link'>Linh kiện máy tính</a>
                                        </div>
                                        <div className='form__search-history-item'>
                                            <a className='form__search-history-link'>Laptop Macbook</a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className='shopping__cart'>
                            <a href='' className='shopping__cart-icon shopping__cart-icon--hover'>
                                <i className='fas fa-cart-plus'></i>
                                <span className='number__cart'>{quantityCart || 0}</span>
                            </a>
                            <div className='header__notify header__notify--cart'>
                                <div className='header__notify-item'>
                                    <div className='header__notify-wrap'>
                                        <div className='header__notify-title'>Sản phẩm đã thêm</div>
                                        <div className='header__notify-wrap-list'>
                                            {state.datacart?.map((cart, index) => {
                                                return state.datacart.length > 0 ? (
                                                    // eslint-disable-next-line react/jsx-key
                                                    <div className='header__notify-inner' key={index}>
                                                        <div className='header__notify-image-product'>
                                                            <img
                                                                src={`http://localhost:8080/uploads/images/${cart.image}`}
                                                            />
                                                        </div>
                                                        <div className='header__notify-content'>
                                                            <div className='header__notify-content-name'>
                                                                {cart.productName}
                                                            </div>
                                                            <div className='header__notify-content-price'>
                                                                {formatPrice.format(cart.priceSale)}
                                                                <span className='header__notify-content-multipy'>
                                                                    x
                                                                </span>
                                                                <span className='header__notify-content-quantity'>
                                                                    {cart.quantity}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className='btn__del-cart header__notify-content-btn'
                                                            onClick={() => deleteCart(cart.cartId)}>
                                                            Xóa
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <img src={cartEmpty} />
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <a href='/cart' className='header__notify-wrap-btn'>
                                        Xem giỏ hàng
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul className='header__sort-bar'>
                    <li className='header__sort-item header__sort-item--active'>
                        <a className='header__sort-link'>Liên quan</a>
                    </li>
                    <li className='header__sort-item'>
                        <a className='header__sort-link'>Mới nhất</a>
                    </li>
                    <li className='header__sort-item'>
                        <a className='header__sort-link'>Bán chạy</a>
                    </li>
                    <li className='header__sort-item'>
                        <a className='header__sort-link'>Giá</a>
                    </li>
                </ul>
            </header>
        </Fragment>
    )
}

export default AppHeader
