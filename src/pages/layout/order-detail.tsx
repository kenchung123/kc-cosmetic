import React, { useState, useEffect } from 'react'
import UserService from '../../services/layout/user-service'
import { Row, Col, Spin, Radio, Button, message } from 'antd'
import avatar from '../../static/layout/images/avatar.jpg'
import CartService from '../../services/layout/cart-service'
// import OrderPage from './order'
import OrderService from '../../services/layout/order-service'
import { showNotification } from '../../common/notification'
const OrderDetailPage = () => {
    const [state, setState] = useState({
        detailOrder: null,
        detailUser: null,
        loading: true,
        status: null
    })

    const idOrder = () => {
        return location.pathname.split('/order/')[1]
    }

    const dataUser = localStorage.getItem('dataUser')
    const idUser = JSON.parse(dataUser)?.userId
    const idLogin = JSON.parse(localStorage.getItem('infoUser'))?.userId

    let detailOrder = null
    let detailUser = null
    const fetchData = async () => {
        try {
            detailOrder = await OrderService.detailOrder(idOrder())
            detailUser = await UserService.detailUser(idUser || idLogin)
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, detailOrder, detailUser, loading: false }))
    }

    useEffect(() => {
        if (state.loading) {
            fetchData()
        }
    }, [])

    if (state.loading) {
        return <Spin />
    }

    const totalPrice = []
    state.detailOrder.map(cart => {
        totalPrice.push(cart.total)
    })
    const reducer = (accumulator, currentValue) => accumulator + currentValue
    const total = totalPrice.reduce(reducer, 0)
    const formatPrice = new Intl.NumberFormat()

    const changeValue = e => {
        setState(s => ({ ...s, value: e.target.value }))
    }

    const statusOrder = status => {
        if (status === 1) {
            return <p>Chờ xét duyệt</p>
        } else if (status === 2) {
            return <p>Đang giao</p>
        } else if (status === 3) {
            return <p>Đã giao</p>
        } else return <p>Đã hủy</p>
    }

    let status = null
    const cancelOrder = async (idOrder, value) => {
        localStorage.setItem('status', value)
        try {
            status = await OrderService.statusOrder(idOrder, value)
            if (status.status === 200) {
                window.location.href = '/order'
            } else {
                showNotification('error', status.data?.message)
            }
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, status }))
    }

    return (
        <div className='box-payment order-detail'>
            <p style={{ position: 'absolute', fontWeight: 600 }}>
                <i className='fab fa-jedi-order'></i> Xem chi tiết đơn hàng
            </p>
            <div className='infor-status'>
                ID ĐƠN HÀNG : {idOrder()} <span>{statusOrder(state.detailOrder[0]?.status)}</span>
            </div>
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
                    <Col span={16}>
                        <p className='title-payment'>Sản phẩm </p>
                    </Col>
                    <Col span={3}>Đơn giá</Col>
                    <Col span={2}>Số lượng</Col>
                    <Col span={3}>Thành tiền</Col>
                </Row>
                {state.detailOrder.map(order => {
                    return (
                        // eslint-disable-next-line react/jsx-key
                        <Row style={{ marginBottom: '20px', alignItems: 'center' }}>
                            <Col span={2}>
                                <img src={`http://localhost:8080/uploads/images/${order.image}`} />
                            </Col>
                            <Col span={14}>
                                <p>{order.productName}</p>
                            </Col>
                            <Col span={3}>{formatPrice.format(order.price)} đ</Col>
                            <Col span={2}>x {order.quantity}</Col>
                            <Col span={3}>{formatPrice.format(order.total)} đ</Col>
                        </Row>
                    )
                })}
                <div className='total-price'>
                    Tổng số tiền : <span>{formatPrice.format(total)} đ</span>
                </div>
            </div>
            <div className='box-price'>
                <p>
                    Tổng tiền hàng <span>{formatPrice.format(total)} đ</span>
                </p>
                <p>
                    Phí vấn chuyển <span>{formatPrice.format(30000)} đ</span>
                </p>
                <p>
                    Tổng thanh toán <span className='total-payment'>{formatPrice.format(total + 30000)} đ</span>
                </p>
                <div className='payment-methods'>
                    <p className='title-payment'>
                        <i className='fas fa-money-check-alt'></i> Phương thức thanh toán{' '}
                    </p>
                    <p>{state.detailOrder[0]?.paymentMethods}</p>
                </div>
                {state.detailOrder[0]?.status === 1 && (
                    <Button className='btn-green' onClick={() => cancelOrder(state.detailOrder[0]?.orderId, 4)}>
                        Hủy đơn hàng
                    </Button>
                )}
            </div>
        </div>
    )
}

export default OrderDetailPage
