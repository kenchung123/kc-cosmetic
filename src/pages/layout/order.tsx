/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Tabs, Spin } from 'antd'
import OrderService from '../../services/layout/order-service'
const { TabPane } = Tabs
const OrderPage = () => {
    const [state, setState] = useState({
        dataOrder: [],
        loading: true,
        idOrder: null
    })
    let dataOrder = []
    const fetchData = async () => {
        try {
            dataOrder = await OrderService.getOrderByUser()
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, dataOrder, loading: false }))
    }

    useEffect(() => {
        if (state.loading) {
            fetchData()
        }
    }, [])

    if (state.loading) {
        return <Spin />
    }

    // localStorage.removeItem('status')

    const callback = key => {
        console.log(key)
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

    const formatPrice = new Intl.NumberFormat()

    const status = localStorage.getItem('status')
    return (
        <div className='content'>
            <Tabs defaultActiveKey={status ? '5' : '1'} onChange={callback}>
                <TabPane tab='Tất Cả' key='1'>
                    {state.dataOrder.map(order => {
                        console.log(order, 'order')
                        const newLocal = (
                            <div className='item-order'>
                                <p>ID Đơn Hàng: {order.orderId}</p>
                                <div className='box-status'>
                                    <p>{statusOrder(order.status)}</p>
                                    <p>{order.createdDate}</p>
                                </div>
                                {order.orderDetailDTOS?.map(detailOrder => {
                                    return (
                                        // eslint-disable-next-line react/jsx-key
                                        <Row>
                                            <Col span={2}>
                                                <img
                                                    src={`http://localhost:8080/uploads/images/${detailOrder.image}`}
                                                />
                                            </Col>
                                            <Col span={18}>
                                                <p>{detailOrder.productName}</p>
                                                <p>x {detailOrder.quantity}</p>
                                            </Col>
                                            <Col span={4} style={{ textAlign: 'right' }}>
                                                {formatPrice.format(detailOrder.price)} đ
                                            </Col>
                                        </Row>
                                    )
                                })}
                                <p style={{ marginTop: '10px', marginBottom: '0' }}>
                                    Phí ship: {formatPrice.format(30000)} đ
                                </p>
                                <div className='box-total'>
                                    Tổng số tiền: <span>{formatPrice.format(order.totalPayment)} đ</span>
                                </div>
                                <div className='btn-detail'>
                                    <Link to={`order/${order.orderId}`}>Xem chi tiết đơn hàng</Link>
                                </div>
                            </div>
                        )
                        return newLocal
                    })}
                </TabPane>
                <TabPane tab='Chờ Xét Duyệt' key='2'>
                    {state.dataOrder
                        ?.filter(x => x.status === 1)
                        ?.map(order => {
                            return (
                                // eslint-disable-next-line react/jsx-key
                                <div className='item-order'>
                                    <p>ID Đơn Hàng : {order.orderId}</p>
                                    <div className='box-status'>
                                        <p>{statusOrder(order.status)}</p>
                                        <p>{order.createdDate}</p>
                                    </div>
                                    {order.orderDetailDTOS?.map(detailOrder => {
                                        return (
                                            // eslint-disable-next-line react/jsx-key
                                            <Row>
                                                <Col span={2}>
                                                    <img
                                                        src={`http://localhost:8080/uploads/images/${detailOrder.image}`}
                                                    />
                                                </Col>
                                                <Col span={18}>
                                                    <p>{detailOrder.productName}</p>
                                                    <p>x {detailOrder.quantity}</p>
                                                </Col>
                                                <Col span={4} style={{ textAlign: 'right' }}>
                                                    {formatPrice.format(detailOrder.price)} đ
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                    <div className='box-total'>
                                        Tổng số tiền: <span>{formatPrice.format(order.totalPayment)} đ</span>
                                    </div>
                                    <div className='btn-detail'>
                                        <Link to={`order/${order.orderId}`}>Xem chi tiết đơn hàng</Link>
                                    </div>
                                </div>
                            )
                        })}
                </TabPane>
                <TabPane tab=' Đang Giao' key='3'>
                    {state.dataOrder
                        ?.filter(x => x.status === 2)
                        ?.map(order => {
                            return (
                                <div className='item-order'>
                                    <p>ID Đơn Hàng : {order.orderId}</p>
                                    <div className='box-status'>
                                        <p>{statusOrder(order.status)}</p>
                                        <p>{order.createdDate}</p>
                                    </div>
                                    {order.orderDetailDTOS?.map(detailOrder => {
                                        return (
                                            <Row>
                                                <Col span={2}>
                                                    <img
                                                        src={`http://localhost:8080/uploads/images/${detailOrder.image}`}
                                                    />
                                                </Col>
                                                <Col span={18}>
                                                    <p>{detailOrder.productName}</p>
                                                    <p>x {detailOrder.quantity}</p>
                                                </Col>
                                                <Col span={4} style={{ textAlign: 'right' }}>
                                                    {formatPrice.format(detailOrder.price)} đ
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                    <div className='box-total'>
                                        Tổng số tiền: <span>{formatPrice.format(order.totalPayment)} đ</span>
                                    </div>
                                    <div className='btn-detail'>
                                        <Link to={`order/${order.orderId}`}>Xem chi tiết đơn hàng</Link>
                                    </div>
                                </div>
                            )
                        })}
                </TabPane>
                <TabPane tab='Đã Giao' key='4'>
                    {state.dataOrder
                        ?.filter(x => x.status === 3)
                        ?.map(order => {
                            return (
                                <div className='item-order'>
                                    <p>ID Đơn Hàng : {order.orderId}</p>
                                    <div className='box-status'>
                                        <p>{statusOrder(order.status)}</p>
                                        <p>{order.createdDate}</p>
                                    </div>
                                    {order.orderDetailDTOS?.map(detailOrder => {
                                        return (
                                            <Row>
                                                <Col span={2}>
                                                    <img
                                                        src={`http://localhost:8080/uploads/images/${detailOrder.image}`}
                                                    />
                                                </Col>
                                                <Col span={18}>
                                                    <p>{detailOrder.productName}</p>
                                                    <p>x {detailOrder.quantity}</p>
                                                </Col>
                                                <Col span={4} style={{ textAlign: 'right' }}>
                                                    {formatPrice.format(detailOrder.price)} đ
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                    <div className='box-total'>
                                        Tổng số tiền: <span>{formatPrice.format(order.totalPayment)} đ</span>
                                    </div>
                                    <div className='btn-detail'>
                                        <Link to={`order/${order.orderId}`}>Xem chi tiết đơn hàng</Link>
                                    </div>
                                </div>
                            )
                        })}
                </TabPane>
                <TabPane tab='Đã Hủy' key='5'>
                    {state.dataOrder
                        ?.filter(x => x.status === 4)
                        ?.map(order => {
                            console.log(order, 'order')
                            return (
                                <div className='item-order'>
                                    <p>ID Đơn Hàng : {order.orderId}</p>
                                    <div className='box-status'>
                                        <p>{statusOrder(order.status)}</p>
                                        <p>{order.createdDate}</p>
                                    </div>
                                    {order.orderDetailDTOS?.map(detailOrder => {
                                        return (
                                            <Row>
                                                <Col span={2}>
                                                    <img
                                                        src={`http://localhost:8080/uploads/images/${detailOrder.image}`}
                                                    />
                                                </Col>
                                                <Col span={18}>
                                                    <p>{detailOrder.productName}</p>
                                                    <p>x {detailOrder.quantity}</p>
                                                </Col>
                                                <Col span={4} style={{ textAlign: 'right' }}>
                                                    {formatPrice.format(detailOrder.price)} đ
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                    <div className='box-total'>
                                        Tổng số tiền: <span>{formatPrice.format(order.totalPayment)} đ</span>
                                    </div>
                                    <div className='btn-detail'>
                                        <Link to={`order/${order.orderId}`}>Xem chi tiết đơn hàng</Link>
                                    </div>
                                </div>
                            )
                        })}
                </TabPane>
            </Tabs>
        </div>
    )
}

export default OrderPage
