import React, { useState, useEffect } from 'react'
import { Table, Input, Button, Modal, Form, Upload } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import BrandService from '../../services/admin/brand-service'
import { showNotification } from '../../common/notification'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

const BrandPage = () => {
    const [form] = Form.useForm()
    const [state, setState] = useState({
        brandList: [],
        visible: false,
        actionStatus: '',
        editBrand: null,
        imageUrl: '',
        logo: '',
        loading: false,
        keyword: '',
        dataBrand: []
    })

    let brandList = []
    const fetchData = async () => {
        try {
            brandList = await BrandService.getBrand()
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, brandList }))
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        form.setFieldsValue({
            brandName: state.editBrand?.brandName,
            description: state.editBrand?.description,
            logo: state.editBrand?.logo
        })
    }, [state])

    const showModal = (id: string) => {
        if (id) {
            const brand = state.brandList.find(p => p.brandId === id)
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
        const { brandList } = state
        if (state.actionStatus === 'Adding') form.resetFields()
        setState(s => ({
            ...s,
            brandList: [...brandList],
            visible: false,
            actionStatus: '',
            editBrand: {},
            imageUrl: ''
        }))
    }

    const columns = [
        {
            title: 'Mã thương hiệu',
            dataIndex: 'brandId',
            key: 'brandId'
        },
        {
            title: 'Tên thương hiệu',
            dataIndex: 'brandName',
            key: 'brandName',
            width: '20%'
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (logo: any) => {
                return <img src={`http://localhost:8080/uploads/images/${logo}`} />
            }
        },
        {
            render: (record: any) => <DeleteOutlined onClick={() => deleteBrand(record.brandId)} />
        },
        {
            render: (record: any) => <EditOutlined onClick={() => showModal(record.brandId)} />
        }
    ]
    const deleteBrand = async (id: any) => {
        let { brandList } = state
        try {
            const deleteList = await BrandService.deleteBrand(id)
            if (deleteList.status === 200) {
                brandList = brandList.filter(x => x.brandId !== id)
                showNotification('success', '', 'Thương hiệu', 'Xóa')
            } else {
                showNotification('error', deleteList.data?.message)
            }
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, brandList: brandList.filter(x => x.brandId !== id) }))
    }

    const onFinish = async values => {
        const { brandList, actionStatus } = state
        const param = values
        param['logo'] = state.logo || state.editBrand?.logo
        const id = state.editBrand?.brandId
        let addBrand = { data: { statusText: '' }, status: null }
        try {
            if (actionStatus === 'Adding') addBrand = await BrandService.addBrand(param)
            else {
                param['brandId'] = id
                addBrand = await BrandService.editBrand(param)
            }
            if (addBrand.status === 200) {
                showNotification('success', '', 'Thương hiệu', actionStatus === 'Adding' ? 'thêm' : 'cập nhật')
            } else {
                showNotification('error', addBrand.data?.statusText)
            }
        } catch (error) {
            console.log('error')
        }
        form.resetFields()
        window.location.reload()
        setState(s => ({ ...s, brandList: [...brandList], editBrand: {}, actionStatus: '', visible: false }))
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
                setState(s => ({ ...s, imageUrl, logo: info.file.name, loading: false }))
            )
        }
    }

    const { editBrand } = state

    // search
    const handleSearch = event => {
        if (event.target?.value) {
            state.keyword = event.target?.value
        } else setState(s => ({ ...s, keyword: '' }))
    }

    const changeText = () => {
        const { brandList, keyword } = state
        if (state.keyword) {
            const dataBrand =
                brandList.filter(g => g.brandName?.toLowerCase().includes(keyword?.toLowerCase())) ||
                brandList.filter(g => g.description?.toLowerCase().includes(keyword?.toLowerCase()))
            setState(s => ({ ...s, keyword, dataBrand: dataBrand }))
        } else {
            setState(s => ({ ...s, keyword, dataBrand: brandList }))
        }
    }
    // end search

    return (
        <div className='box-brand'>
            <h1 className='mt-4'>Thương hiệu</h1>
            <ol className='breadcrumb mb-4'>
                <li className='breadcrumb-item active'>Thương hiệu</li>
            </ol>
            <div className='card mb-4'>
                <div className='card-header'>
                    <i className='fas fa-table mr-1' />
                    Danh sách thương hiệu
                </div>
                <div className='card-body'>
                    <Button className='mb-2 btn-add' type='primary' onClick={() => showModal(null)}>
                        Thêm
                    </Button>
                    <div className='box-search'>
                        <Input placeholder='Tìm thương hiệu' onChange={handleSearch} name='keyword'></Input>
                        <Button onClick={() => changeText()}>Tìm kiếm</Button>
                    </div>
                    <Modal
                        title={state.actionStatus === 'Adding' ? 'Thêm thương hiệu' : 'Sửa thương hiệu'}
                        visible={state.visible}
                        onCancel={handleCancel}>
                        <Form
                            form={form}
                            initialValues={{
                                brandName: state.editBrand?.brandName,
                                description: state.editBrand?.description,
                                logo: state.editBrand?.logo
                            }}
                            onFinish={onFinish}>
                            <Form.Item
                                label='Tên thương hiệu'
                                name='brandName'
                                rules={[{ required: true, message: 'Please input your brandName!' }]}>
                                <Input defaultValue={editBrand?.brandName} placeholder='Tên thương hiệu' />
                            </Form.Item>

                            <Form.Item
                                label='Mô tả'
                                name='description'
                                rules={[{ required: true, message: 'Please input your description!' }]}>
                                <Input.TextArea
                                    rows={4}
                                    defaultValue={state.editBrand?.description}
                                    placeholder='Mô tả'
                                />
                            </Form.Item>

                            <Form.Item label='Logo' name='logo'>
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
                                                `http://localhost:8080/uploads/images/${state.editBrand?.logo}`
                                            }
                                        />
                                    ) : (
                                        <div>
                                            {state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div className='ant-upload-text'>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
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
                        dataSource={state.dataBrand.length > 0 ? state.dataBrand : state.brandList}
                    />
                </div>
            </div>
        </div>
    )
}

export default BrandPage
