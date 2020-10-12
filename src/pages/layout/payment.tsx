import React, { useState, useEffect } from 'react'
import UserService from '../../services/layout/user-service'
import { Row, Col, Spin, Radio, Button, message } from 'antd'
import CartService from '../../services/layout/cart-service'
import OrderService from '../../services/layout/order-service'
const PaymentPage = () => {
    const [state, setState] = useState({
        detailUser: null,
        loading: true,
        value: 'Thanh toán khi nhận hàng',
        dataOrder: [],
        datacart: [],
        total: 0
    })

    const dataUser = localStorage.getItem('dataUser')
    const idUser = JSON.parse(dataUser)?.userId
    const idLogin = JSON.parse(localStorage.getItem('infoUser'))?.userId
    const chooseCart = JSON.parse(localStorage.getItem('choose-cart'))
    let detailUser = null
    let datacart = []
    let total = 0
    const dataOrder = []
    const fetchData = async () => {
        try {
            detailUser = await UserService.detailUser(idUser || idLogin)
            datacart = await CartService.getCart(idUser || idLogin)
        } catch (error) {
            console.log('error')
        }
        datacart.forEach(i => {
            if (chooseCart.some(id => id === i.cartId)) {
                total += i.total
                dataOrder.push({
                    cartId: i.cartId,
                    productId: i.productId,
                    priceSale: i.priceSale,
                    quantity: i.quantity,
                    payment: state.value
                })
            }
        })
        setState(s => ({ ...s, detailUser, datacart, total, dataOrder, loading: false }))
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
    const formatPrice = new Intl.NumberFormat()

    const changeValue = e => {
        setState(s => ({ ...s, value: e.target.value }))
    }
    const order = async () => {
        const { dataOrder } = state
        dataOrder.map(x => {
            x.payment = state.value
        })
        try {
            const res = await OrderService.addOrder(dataOrder)
            if (res.status === 200) {
                message.success('Đặt hàng thành công')
                window.location.href = '/order'
            }
        } catch (error) {
            console.log('error')
        }
    }
    return (
        <div className='box-payment box-main'>
            <h4>Thanh Toán</h4>
            <div className='info-payment'>
                <p>
                    <i className='fas fa-map-marker-alt'></i> Địa chỉ nhận hàng
                </p>
                <p className='text-payment'>
                    <span>{state.detailUser?.fullName}</span> <span>{state.detailUser?.phoneNumber}</span>{' '}
                    <span>{state.detailUser?.address}</span>
                </p>
            </div>
            <div className='product-payment'>
                <Row>
                    <Col span={18}>
                        <p className='title-payment'>Sản phẩm </p>
                    </Col>
                    <Col span={2}>Đơn giá</Col>
                    <Col span={2}>Số lượng</Col>
                    <Col span={2}>Thành tiền</Col>
                </Row>
                {state.datacart?.map(cart => {
                    return chooseCart.some(id => cart.cartId === id) ? (
                        // eslint-disable-next-line react/jsx-key
                        <Row style={{ marginBottom: '20px', alignItems: 'center' }}>
                            <Col span={2}>
                                <img src={`http://localhost:8080/uploads/images/${cart.image}`} />
                            </Col>
                            <Col span={16}>
                                <p>{cart.productName}</p>
                            </Col>
                            <Col span={2}>{formatPrice.format(cart.priceSale)} đ</Col>
                            <Col span={2}>x {cart.quantity}</Col>
                            <Col span={2}>{formatPrice.format(cart.total)} đ</Col>
                        </Row>
                    ) : null
                })}
                <div className='total-price'>
                    Tổng số tiền : <span>{formatPrice.format(state.total)} đ</span>
                </div>
            </div>
            <div className='payment-methods'>
                <p className='title-payment'>Phương thức thanh toán </p>
                <Radio.Group onChange={changeValue} value={state.value}>
                    <Radio value='Thanh toán khi nhận hàng'>Thanh toán khi nhận hàng</Radio>
                    <Radio value='Chuyển khoản qua thẻ ATM'>Chuyển khoản qua thẻ ATM</Radio>
                </Radio.Group>
            </div>
            <div className='box-price'>
                <p>
                    Tổng tiền hàng <span>{formatPrice.format(state.total)} đ</span>
                </p>
                <p>
                    Phí vấn chuyển <span>{formatPrice.format(30000)} đ</span>
                </p>
                <p>
                    Tổng thanh toán <span className='total-payment'>{formatPrice.format(state.total + 30000)} đ</span>
                </p>
                <Button className='btn-green' onClick={() => order()}>
                    Đặt Hàng
                </Button>
            </div>
        </div>
    )
}

export default PaymentPage
