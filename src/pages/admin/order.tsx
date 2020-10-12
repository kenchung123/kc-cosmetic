import React, { useState, useEffect } from 'react'
import { Table, Input, Button, Modal, Row, Col, Tag, Select } from 'antd'
import { UnorderedListOutlined, EditOutlined } from '@ant-design/icons'
import OrderService from '../../services/admin/order-service'
import { showNotification } from '../../common/notification'
const OrderPage = () => {
    const [state, setState] = useState({
        searchText: '',
        searchedColumn: '',
        orderList: [],
        visible: false,
        orderDetail: [],
        status: null,
        actionStatus: '',
        editOrder: null,
        dataOrder: [],
        keyword: ''
    })

    let orderList = []
    const fetchData = async () => {
        try {
            orderList = await OrderService.getOrder()
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, orderList }))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCancel = () => {
        setState(s => ({ ...s, visible: false, orderDetail: [], actionStatus: '' }))
    }

    let orderDetail = []
    const showModal = async (id: string) => {
        try {
            orderDetail = await OrderService.detailOrder(id)
            console.log(orderDetail, 'orderDetail')
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, orderDetail, visible: true }))
    }

    const editStatus = record => {
        const editOrder = state.orderList.find(x => x.orderId === record.orderId)
        setState(s => ({ ...s, actionStatus: 'edit-status', editOrder: Object.assign({}, editOrder) }))
    }

    let status = null
    const changeStatus = async (order, value) => {
        try {
            status = await OrderService.statusOrder(order.orderId, value)
            if (status.status === 200) {
                showNotification('success', '', 'Trạng thái', 'cập nhật')
                window.location.reload()
            } else {
                showNotification('error', status.data?.message)
            }
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, status: status.data?.status, actionStatus: '' }))
    }

    const statusOrder = record => {
        if (record.status === 1) {
            return <Tag color='green'>Chờ xét duyệt</Tag>
        } else if (record.status === 2) {
            return <Tag color='orange'>Đang giao</Tag>
        } else if (record.status === 3) {
            return <Tag color='blue'>Đã giao</Tag>
        } else return <Tag color='red'>Đã hủy</Tag>
    }

    const { Option } = Select

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderId',
            key: 'orderId'
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethods',
            key: 'paymentMethods',
            width: '20%'
        },
        {
            title: 'Trạng thái',
            dataIndex: '',
            key: 'status',
            render: (record: any) => {
                return (
                    <div>
                        {state.actionStatus === 'edit-status' && state.editOrder?.orderId === record.orderId ? (
                            <Select
                                defaultValue={record.status}
                                style={{ width: 120 }}
                                onChange={e => changeStatus(record, e)}>
                                <Option value={1}>Chờ xét duyệt</Option>
                                <Option value={2}>Đang giao</Option>
                                <Option value={3}>Đã giao</Option>
                                <Option value={4} disabled>
                                    Đã hủy
                                </Option>
                            </Select>
                        ) : (
                            statusOrder(record)
                        )}
                        {state.actionStatus === 'edit-status' && state.editOrder?.orderId === record.orderId ? (
                            <span
                                style={{ marginLeft: '10px', cursor: 'pointer' }}
                                onClick={() => {
                                    handleCancel()
                                }}>
                                Hủy
                            </span>
                        ) : (
                            <EditOutlined onClick={() => editStatus(record)} />
                        )}
                    </div>
                )
            }
        },
        {
            title: 'Tên Khách hàng',
            dataIndex: 'fullName',
            key: 'fullName'
        },
        {
            title: 'Ngày lập',
            dataIndex: 'createdDate',
            key: 'createdDate'
        },
        {
            render: (record: any) => <UnorderedListOutlined onClick={() => showModal(record.orderId)} />
        }
    ]

    // search
    const handleSearch = event => {
        if (event.target?.value) {
            state.keyword = event.target?.value
        } else setState(s => ({ ...s, keyword: '' }))
    }

    const changeText = () => {
        const { productsList, keyword } = state
        if (state.keyword) {
            const dataOrder = productsList.filter(g => g.fullName?.toLowerCase().includes(keyword?.toLowerCase()))
            setState(s => ({ ...s, keyword, dataOrder: dataOrder }))
        } else {
            setState(s => ({ ...s, keyword, dataOrder: productsList }))
        }
    }
    // end search

    return (
        <div className='box-order'>
            <h1 className='mt-4'>Đơn hàng</h1>
            <ol className='breadcrumb mb-4'>
                <li className='breadcrumb-item active'>Đơn hàng</li>
            </ol>
            <div className='card mb-4'>
                <div className='card-header'>
                    <i className='fas fa-table mr-1' />
                    Danh sách đơn hàng
                </div>
                <div className='card-body'>
                    <div className='box-search' style={{ marginBottom: '20px' }}>
                        <Input placeholder='Tìm khách hàng' onChange={handleSearch} name='keyword'></Input>
                        <Button onClick={() => changeText()}>Tìm kiếm</Button>
                    </div>
                    <Modal title='Chi tiết đơn hàng' visible={state.visible} onCancel={handleCancel}>
                        {state.orderDetail.length > 0 && (
                            <div className='box-product'>
                                <div>Hình ảnh</div>
                                <div>
                                    <Row>
                                        <Col span={10}>Sản phẩm</Col>
                                        <Col span={6}>
                                            <p>Đơn giá</p>
                                        </Col>
                                        <Col span={8}>
                                            <p>Tổng Tiền</p>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        )}
                        {state.orderDetail?.map(item => {
                            return (
                                // eslint-disable-next-line react/jsx-key
                                <div className='box-product'>
                                    <div>
                                        <img src={`http://localhost:8080/uploads/images/${item.image}`} />
                                    </div>
                                    <div>
                                        <Row>
                                            <Col span={10}>
                                                <p>{item.productName}</p>
                                                <p>x {item.quantity}</p>
                                            </Col>
                                            <Col span={6}>
                                                <p>{item.price}</p>
                                            </Col>
                                            <Col span={8}>
                                                <p>{item.total}</p>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            )
                        })}
                    </Modal>
                    <Table
                        columns={columns}
                        dataSource={state.dataOrder.length > 0 ? state.dataOrder : state.orderList}
                    />
                </div>
            </div>
        </div>
    )
}

export default OrderPage
