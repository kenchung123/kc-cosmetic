import React, { useState, useEffect } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Table, InputNumber, message, Button, Checkbox } from 'antd'
import CartService from '../../services/layout/cart-service'
import cartEmpty from '../../static/layout/images/cart-empty.png'
import { Link } from 'react-router-dom'
const CartPage = () => {
    const [state, setState] = useState({
        datacart: [],
        updateQt: null,
        deleteCart: null,
        selectedRowKeys: [],
        cheked: true,
        valueCheck: true
        // loading: true,
    })

    const dataUser = localStorage.getItem('dataUser')
    const idUser = JSON.parse(dataUser)?.userId
    const idLogin = JSON.parse(localStorage.getItem('infoUser'))?.userId

    let datacart = []
    const fetchData = async () => {
        const id = idUser || idLogin
        try {
            datacart = await CartService.getCart(id)
        } catch (error) {
            console.log('error')
        }
        const selectProduct = []
        if (state.cheked) {
            datacart.forEach(i => selectProduct.push(i.cartId))
        }
        setState(s => ({
            ...s,
            datacart,
            selectedRowKeys: selectProduct
        }))
    }

    useEffect(() => {
        fetchData()
    }, [])
    localStorage.removeItem('status')

    console.log(state.datacart, 'datacart cart')

    let updateQt = null
    const changeQuantity = async (value, id) => {
        try {
            updateQt = await CartService.updateQuantity(id, value)
            if (updateQt.status === 200) {
                message.success('Cập nhật giỏ hàng thành công')
            }
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, updateQt: updateQt.data }))
    }

    let deleteCart = null
    const deleteCartById = async id => {
        try {
            deleteCart = await CartService.deleteCart(id)
            if (deleteCart.status === 200) {
                message.success('Xóa sản phẩm thành công')
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            }
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, deleteCart: deleteCart.data }))
    }

    const onChangeKey = (e, productId) => {
        const { selectedRowKeys } = state
        if (e.target.checked === true) {
            selectedRowKeys.push(productId)
            setState(s => ({ ...s, selectedRowKeys: selectedRowKeys }))
        } else {
            setState(s => ({
                ...s,
                selectedRowKeys: selectedRowKeys.filter(x => x !== productId) || []
            }))
        }
    }

    const onCheckAllChange = e => {
        if (e.target.checked === true) {
            const selectProduct = []
            state.datacart.forEach(i => selectProduct.push(i.cartId))
            setState(s => ({
                ...s,
                cheked: true,
                selectedRowKeys: selectProduct
            }))
        } else {
            setState(s => ({
                ...s,
                cheked: false,
                selectedRowKeys: []
            }))
        }
    }

    localStorage.setItem('choose-cart', JSON.stringify(state.selectedRowKeys))
    console.log(state.datacart, 'datacart')
    const formatPrice = new Intl.NumberFormat()
    const columns = [
        {
            title: '',
            render: record => {
                return (
                    <Checkbox
                        // defaultChecked={state.cheked}
                        checked={state.selectedRowKeys.some(product => product === record.cartId)}
                        onChange={e => onChangeKey(e, record.cartId)}
                    />
                )
            }
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            render: text => <a>{text}</a>
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image: any) => {
                return <img src={`http://localhost:8080/uploads/images/${image}`} />
            }
        },
        {
            title: 'Số lượng',
            dataIndex: '',
            key: 'quantity',
            render: (record: any) => {
                return (
                    <InputNumber
                        min={1}
                        max={100}
                        defaultValue={record.quantity}
                        onChange={e => changeQuantity(e, record.cartId)}
                    />
                )
            }
        },
        {
            title: 'Đơn giá',
            dataIndex: 'priceSale',
            key: 'priceSale',
            render: priceSale => formatPrice.format(priceSale)
        },
        {
            title: 'Tổng tiền',
            dataIndex: '',
            key: 'total',
            render: record => {
                return state.updateQt?.cartId === record.cartId ? (
                    <span>{formatPrice.format(state.updateQt?.total)}</span>
                ) : (
                    formatPrice.format(record.total)
                )
            }
        },
        {
            render: (record: any) => <DeleteOutlined onClick={() => deleteCartById(record.cartId)} />
        }
    ]

    // deleteAll
    let deletedeleteAll = null
    const deleteAll = async () => {
        try {
            deletedeleteAll = await CartService.deleteAllCart()
            if (deletedeleteAll.status === 200) {
                message.success('Xóa tất cả giỏ hàng thành công')
                setState(s => ({ ...s, datacart: deletedeleteAll }))
            }
        } catch (error) {
            console.log('error')
        }
    }

    return (
        <div className='box-main'>
            <section className='breadcrumb-area'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='breadcrumbs text-center'>
                                <h1>Giỏ hàng</h1>
                                <h4>Giỏ hàng của bạn</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='breadcrumb-bottom-area'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-lg-8 col-md-5 col-sm-5'>
                                <ul>
                                    <li>
                                        <a href='#'>Trang chủ</a>
                                    </li>
                                    <li>
                                        <a href='#'>
                                            <i className='fa fa-angle-right' />
                                        </a>
                                    </li>
                                    <li>Giỏ hàng</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='product__detail box-cart'>
                {state.datacart.length > 0 ? (
                    <div className='grid wide' style={{ position: 'relative' }}>
                        <div>
                            <div className='checked-all'>
                                <Checkbox
                                    checked={state.selectedRowKeys?.length === state.datacart?.length}
                                    onChange={onCheckAllChange}
                                />
                            </div>
                            <Table columns={columns} dataSource={state.datacart} />
                            <div style={{ marginLeft: '15px' }}>
                                <Checkbox
                                    checked={state.selectedRowKeys?.length === state.datacart?.length}
                                    onChange={onCheckAllChange}>
                                    Chọn tất cả
                                </Checkbox>
                                <Button
                                    disabled={state.cheked === false ? true : false}
                                    onClick={() => {
                                        deleteAll()
                                    }}>
                                    Xóa tất cả
                                </Button>
                            </div>
                        </div>
                        <div className='cart__info-continute'>
                            <a className='btn__del-cart btn__del-cart--all btn__del-cart--continute'>
                                <i className='fas fa-arrow-left'></i> Tiếp tục mua hàng
                            </a>
                            <a className='btn__del-cart btn__del-cart--all btn__del-cart--pay' href='/payment'>
                                <i className='fas fa-money-check-alt'></i> Thanh toán
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className='cart-empty'>
                        <img src={cartEmpty} />
                        <h4>Giỏ hàng của bạn đang trống</h4>
                        <Link to='/'>
                            <Button>Mua Ngay</Button>
                        </Link>
                    </div>
                )}
            </section>
        </div>
    )
}

export default CartPage
