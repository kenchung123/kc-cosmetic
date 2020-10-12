import React, { useState, useEffect } from 'react'
import { Table, Input, Button, Modal, Form, Select, Upload, InputNumber, Row, Col } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { showNotification } from '../../common/notification'
import ProductsService from '../../services/admin/products-service'
import BrandService from '../../services/admin/brand-service'
import CategorysService from '../../services/admin/categorys-service'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const ProductsPage = () => {
    const [form] = Form.useForm()
    const [state, setState] = useState({
        searchText: '',
        searchedColumn: '',
        productsList: [],
        brandList: [],
        categorysList: [],
        visible: false,
        actionStatus: '',
        editBrand: null,
        changeValue: '',
        changeCategoryName: '',
        loading: false,
        imageUrl: '',
        imageProduct: '',
        keyword: '',
        dataProduct: []
    })

    let productsList = []
    let brandList = []
    let categorysList = []
    const fetchData = async () => {
        try {
            productsList = await ProductsService.getProducts()
            brandList = await BrandService.getBrand()
            categorysList = await CategorysService.getCategorys()
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, productsList, brandList, categorysList }))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const showModal = (id: string) => {
        if (id) {
            const brand = state.productsList.find(p => p.productId === id)
            setState(s => ({
                ...s,
                editBrand: Object.assign({}, brand),
                actionStatus: 'Editing',
                visible: true
            }))
            form.resetFields()
        } else {
            form.resetFields()
            setState(s => ({ ...s, editBrand: {}, actionStatus: 'Adding', visible: true }))
        }
    }
    const handleCancel = () => {
        const { productsList } = state
        if (state.actionStatus === 'Adding') form.resetFields()
        setState(s => ({
            ...s,
            productsList: [...productsList],
            visible: false,
            actionStatus: '',
            editBrand: {},
            imageUrl: ''
        }))
    }

    const columns = [
        {
            title: 'Mã sản phẩm',
            dataIndex: 'productId',
            key: 'productId'
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
            width: '20%'
        },
        {
            title: 'Tên thương hiệu',
            dataIndex: 'brandName',
            key: 'brandName',
            width: '20%'
        },
        {
            title: 'Tên thể loại',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: '20%'
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
            key: 'discount',
            width: '20%'
        },
        {
            title: 'Giá gốc',
            dataIndex: 'price',
            key: 'price',
            width: '20%'
        },
        {
            title: 'Giá khuyến mãi',
            dataIndex: 'priceSale',
            key: 'priceSale',
            width: '20%'
        },
        {
            title: 'Mô tả sản phẩm',
            dataIndex: 'productDescription',
            key: 'productDescription',
            width: '20%',
            render: (productDescription: any) => {
                return (
                    <div style={{ width: '250px' }}>
                        <span className='content-des' dangerouslySetInnerHTML={{ __html: productDescription }} />
                    </div>
                )
            }
        },
        {
            title: 'Thông tin sản phẩm',
            dataIndex: 'productInfo',
            key: 'productInfo',
            width: '20%',
            render: (productInfo: any) => {
                return <div style={{ width: '250px' }}>{productInfo}</div>
            }
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '20%'
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            width: '20%',
            render: (image: any) => {
                return <img src={`http://localhost:8080/uploads/images/${image}`} />
            }
        },
        {
            render: (record: any) => <DeleteOutlined onClick={() => deleteProduct(record.productId)} />
        },
        {
            render: (record: any) => <EditOutlined onClick={() => showModal(record.productId)} />
        }
    ]

    const deleteProduct = async (id: any) => {
        let { productsList } = state
        try {
            const deleteList = await ProductsService.deleteProducts(id)
            if (deleteList.status === 200) {
                productsList = productsList.filter(x => x.productId !== id)
                showNotification('success', '', 'Sản phẩm', 'xóa')
            } else {
                showNotification('error', deleteList.data?.message)
            }
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, productsList: productsList.filter(x => x.productId !== id) }))
    }

    const onFinish = async values => {
        const { productsList, actionStatus } = state
        const param = values
        param['productDescription'] = state.editBrand?.productDescription
        param['brandId'] = state.changeValue
        param['brandName'] = state.brandList.find(x => x.brandId === state.changeValue)?.brandName
        param['categoryId'] = state.changeCategoryName
        param['categoryName'] = state.categorysList.find(x => x.categoryId === state.changeCategoryName)?.categoryName
        param['image'] = state.imageProduct
        const id = state.editBrand?.productId
        let actionProduct = { data: { statusText: '' }, status: null }
        try {
            if (actionStatus === 'Adding') actionProduct = await ProductsService.addProducts(param)
            else {
                param['productId'] = id
                param['brandId'] = state.editBrand?.brandId
                param['brandName'] = state.editBrand?.brandName
                param['categoryId'] = state.editBrand?.categoryId
                param['categoryName'] = state.editBrand?.categoryName
                param['image'] = state.imageProduct || state.editBrand?.image
                actionProduct = await ProductsService.editProducts(param)
            }
            if (actionProduct.status === 200) {
                showNotification('success', '', 'Sản phẩm', actionStatus === 'Adding' ? 'thêm' : 'cập nhật')
            } else {
                showNotification('error', actionProduct.data?.statusText)
            }
        } catch (error) {
            console.log('error')
        }
        form.resetFields()
        window.location.reload()
        setState(s => ({
            ...s,
            productsList: [...productsList],
            editBrand: {},
            actionStatus: '',
            visible: false
        }))
    }

    const changeBrandName = value => {
        setState(s => ({
            ...s,
            changeValue: value
        }))
    }

    const changeCategoryName = value => {
        setState(s => ({
            ...s,
            changeCategoryName: value
        }))
    }

    function getBase64(img, callback) {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
    }

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setState(s => ({ ...s, loading: true }))
            return
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl =>
                setState(s => ({ ...s, imageUrl, imageProduct: info.file.name, loading: false }))
            )
        }
    }

    function changeItem(value: string, key: string) {
        const { editBrand } = state
        editBrand[key] = value
        setState(s => ({ ...s, editBrand: Object.assign({}, editBrand) }))
    }

    // search
    const handleSearch = event => {
        if (event.target?.value) {
            state.keyword = event.target?.value
        } else setState(s => ({ ...s, keyword: '' }))
    }

    const changeText = () => {
        const { productsList, keyword } = state
        if (state.keyword) {
            const dataProduct =
                productsList.filter(g => g.productName?.toLowerCase().includes(keyword?.toLowerCase())) ||
                productsList.filter(g => g.categoryName?.toLowerCase().includes(keyword?.toLowerCase())) ||
                productsList.filter(g => g.brandName?.toLowerCase().includes(keyword?.toLowerCase()))
            setState(s => ({ ...s, keyword, dataProduct: dataProduct }))
        } else {
            setState(s => ({ ...s, keyword, dataProduct: productsList }))
        }
    }
    // end search

    const { Option } = Select
    const { editBrand } = state
    return (
        <div className='box-brand product'>
            <h1 className='mt-4'>Sản phẩm</h1>
            <ol className='breadcrumb mb-4'>
                <li className='breadcrumb-item active'>Sản phẩm</li>
            </ol>
            <div className='card mb-4'>
                <div className='card-header'>
                    <i className='fas fa-table mr-1' />
                    Danh sách sản phẩm
                </div>
                <div className='card-body'>
                    <Button className='mb-2 btn-add' type='primary' onClick={() => showModal(null)}>
                        Thêm
                    </Button>
                    <div className='box-search'>
                        <Input
                            placeholder='Tìm sản phẩm, thương hiệu, thể loại'
                            onChange={handleSearch}
                            name='keyword'></Input>
                        <Button onClick={() => changeText()}>Tìm kiếm</Button>
                    </div>
                    <Modal
                        className='modal-product'
                        title={state.actionStatus === 'Adding' ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}
                        visible={state.visible}
                        onCancel={handleCancel}>
                        <Form
                            form={form}
                            initialValues={{
                                productName: state.editBrand?.productName,
                                categoryName: state.editBrand?.categoryName,
                                discount: state.editBrand?.discount,
                                price: state.editBrand?.price,
                                priceSale: state.editBrand?.priceSale,
                                productDescription: state.editBrand?.productDescription,
                                quantity: state.editBrand?.quantity,
                                productInfo: state.editBrand?.productInfo,
                                brandName: state.editBrand?.brandName
                            }}
                            onFinish={onFinish}>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label='Tên sản phẩm'
                                        name='productName'
                                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                                        <Input defaultValue={editBrand?.productName} placeholder='Nhập tên sản phẩm' />
                                    </Form.Item>
                                    <Form.Item
                                        label='Giảm giá'
                                        name='discount'
                                        rules={[{ required: true, message: 'Vui lòng nhập giảm giá!' }]}>
                                        <Input defaultValue={editBrand?.discount} placeholder='Nhập giảm giá' />
                                    </Form.Item>
                                    <Form.Item
                                        label='Giá gốc'
                                        name='price'
                                        rules={[{ required: true, message: 'Vui lòng nhập giá gốc!' }]}>
                                        <Input defaultValue={editBrand?.price} placeholder='Nhập giá gốc' />
                                    </Form.Item>
                                    <Form.Item
                                        label='Giá khuyến mãi'
                                        name='priceSale'
                                        rules={[{ required: true, message: 'Vui lòng nhập giá khuyến mãi!' }]}>
                                        <Input defaultValue={editBrand?.priceSale} placeholder='Nhập giá khuyến mãi' />
                                    </Form.Item>
                                    <Form.Item
                                        label='Mô tả sản phẩm'
                                        name='productDescription'
                                        rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}>
                                        <CKEditor
                                            placeholder='Nhập mô tả sản phẩm'
                                            editor={ClassicEditor}
                                            data={editBrand?.productDescription}
                                            onChange={(e, editor) =>
                                                changeItem(editor.getData().toString(), 'productDescription')
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label='Số lượng'
                                        name='quantity'
                                        rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
                                        <InputNumber min={1} max={10} defaultValue={editBrand?.quantity} />
                                    </Form.Item>
                                    <Form.Item
                                        label='Thông tin sản phẩm'
                                        name='productInfo'
                                        rules={[{ required: true, message: 'Vui lòng nhập thông tin sản phẩm!' }]}>
                                        <Input
                                            defaultValue={editBrand?.productInfo}
                                            placeholder='Nhập thông tin sản phẩm'
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label='Tên thương hiệu'
                                        name='brandName'
                                        rules={[{ required: true, message: 'Vui lòng nhập tên thương hiệu!' }]}>
                                        <Select
                                            placeholder='Select Option '
                                            defaultValue={editBrand?.brandName}
                                            onChange={e => changeBrandName(e)}>
                                            {state.brandList?.map(brand => {
                                                // eslint-disable-next-line react/jsx-key
                                                return <Option value={brand.brandId}>{brand.brandName}</Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label='Tên thể loại'
                                        name='categoryName'
                                        rules={[{ required: true, message: 'Vui lòng nhập tên thể loại!' }]}>
                                        <Select
                                            placeholder='Select Option '
                                            defaultValue={editBrand?.categoryName}
                                            onChange={e => changeCategoryName(e)}>
                                            {state.categorysList?.map(categorys => {
                                                return (
                                                    // eslint-disable-next-line react/jsx-key
                                                    <Option value={categorys.categoryId}>
                                                        {categorys.categoryName}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label='Hình ảnh' name='image'>
                                        <Upload
                                            name='avatar'
                                            listType='picture-card'
                                            className='avatar-uploader'
                                            showUploadList={false}
                                            action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                                            onChange={handleChange}>
                                            {state.imageUrl || state.actionStatus === 'Editing' ? (
                                                <img
                                                    src={
                                                        state.imageUrl ||
                                                        `http://localhost:8080/uploads/images/${state.editBrand?.image}`
                                                    }
                                                />
                                            ) : (
                                                <div>
                                                    {state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                                                    <div className='ant-upload-text'>Tải ảnh lên</div>
                                                </div>
                                            )}
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className='btn-action'>
                                <Button onClick={() => handleCancel()}>Hủy</Button>
                                <Button type='primary' htmlType='submit'>
                                    {state.actionStatus === 'Adding' ? 'Thêm' : 'Cập nhật'}
                                </Button>
                            </div>
                        </Form>
                    </Modal>
                    <Table
                        columns={columns}
                        dataSource={state.dataProduct.length > 0 ? state.dataProduct : state.productsList}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductsPage
