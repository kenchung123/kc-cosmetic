import React, { useState, useEffect } from 'react'
import { Table, Input, Button, Modal, Form, Select } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { showNotification } from '../../common/notification'
import CategorysService from '../../services/admin/categorys-service'
import GroupcategorysService from '../../services/admin/groupcategorys-service'

const CategorysPage = () => {
    const [form] = Form.useForm()
    const [state, setState] = useState({
        searchText: '',
        searchedColumn: '',
        categorysList: [],
        groupcategorysList: [],
        visible: false,
        actionStatus: '',
        editBrand: null,
        changeValue: '',
        keyword: '',
        dataCategory: []
    })

    let categorysList = []
    let groupcategorysList = []
    const fetchData = async () => {
        try {
            categorysList = await CategorysService.getCategorys()
            groupcategorysList = await GroupcategorysService.getGroupcategorys()
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, categorysList, groupcategorysList }))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const showModal = (id: string) => {
        if (id) {
            const brand = state.categorysList.find(p => p.categoryId === id)
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
        const { categorysList } = state
        if (state.actionStatus === 'Adding') form.resetFields()
        setState(s => ({
            ...s,
            categorysList: [...categorysList],
            visible: false,
            actionStatus: '',
            editBrand: {}
        }))
    }

    const columns = [
        {
            title: 'Mã thể loại',
            dataIndex: 'categoryId',
            key: 'categoryId'
        },
        {
            title: 'Tên thể loại',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: '20%'
        },
        {
            title: 'Tên nhóm thể loại',
            dataIndex: 'groupCategoryName',
            key: 'groupCategoryName',
            width: '20%'
        },
        {
            render: (record: any) => <DeleteOutlined onClick={() => deleteBrand(record.categoryId)} />
        },
        {
            render: (record: any) => <EditOutlined onClick={() => showModal(record.categoryId)} />
        }
    ]
    const deleteBrand = async (id: any) => {
        let { categorysList } = state
        try {
            const deleteList = await CategorysService.deleteCategorys(id)
            if (deleteList.status === 200) {
                categorysList = categorysList.filter(x => x.categoryId !== id)
                showNotification('success', '', 'Thể loại', 'xóa')
            } else {
                showNotification('error', deleteList.data?.message)
            }
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, categorysList: categorysList.filter(x => x.categoryId !== id) }))
    }

    const onFinish = async values => {
        const { categorysList, actionStatus } = state
        const param = values
        param['groupCategoryId'] === state.changeValue
        const id = state.editBrand?.categoryId
        let addBrand = { data: { statusText: '' }, status: null }
        try {
            if (actionStatus === 'Adding') addBrand = await CategorysService.addCategorys(param)
            else {
                param['categoryId'] = id
                addBrand = await CategorysService.editCategorys(param)
            }
            if (addBrand.status === 200) {
                showNotification('success', '', 'Thể loại', actionStatus === 'Adding' ? 'thêm' : 'cập nhật')
            } else {
                showNotification('error', addBrand.data?.statusText)
            }
        } catch (error) {
            console.log('error')
        }
        form.resetFields()
        window.location.reload()
        setState(s => ({
            ...s,
            categorysList: [...categorysList],
            editBrand: {},
            actionStatus: '',
            visible: false
        }))
    }

    const changeGroupCategoryName = value => {
        setState(s => ({
            ...s,
            changeValue: value
        }))
    }
    const { Option } = Select

    // search
    const handleSearch = event => {
        if (event.target?.value) {
            state.keyword = event.target?.value
        } else setState(s => ({ ...s, keyword: '' }))
    }

    const changeText = () => {
        const { categorysList, keyword, dataCategory } = state
        if (state.keyword) {
            const dataCategory =
                categorysList.filter(g => g.categoryName?.toLowerCase().includes(keyword?.toLowerCase())) ||
                categorysList.filter(g => g.groupCategoryName?.toLowerCase().includes(keyword?.toLowerCase()))
            setState(s => ({ ...s, keyword, dataCategory: dataCategory }))
        } else {
            setState(s => ({ ...s, keyword, dataCategory: categorysList }))
        }
    }
    // end search

    return (
        <div className='box-brand'>
            <h1 className='mt-4'>Thể loại</h1>
            <ol className='breadcrumb mb-4'>
                <li className='breadcrumb-item active'>Thể loại</li>
            </ol>
            <div className='card mb-4'>
                <div className='card-header'>
                    <i className='fas fa-table mr-1' />
                    Danh sách thể loại
                </div>
                <div className='card-body'>
                    <Button className='mb-2 btn-add' type='primary' onClick={() => showModal(null)}>
                        Thêm
                    </Button>
                    <div className='box-search'>
                        <Input placeholder='Tìm thể loại, nhóm thể loại' onChange={handleSearch} name='keyword'></Input>
                        <Button onClick={() => changeText()}>Tìm kiếm</Button>
                    </div>
                    <Modal
                        title={state.actionStatus === 'Adding' ? 'Thêm thể loại' : 'Sửa thể loại'}
                        visible={state.visible}
                        onCancel={handleCancel}>
                        <Form
                            form={form}
                            initialValues={{
                                categoryId: state.editBrand?.categoryId,
                                CategoryName: state.editBrand?.categoryName,
                                groupCategoryId: state.editBrand?.groupCategoryId,
                                groupCategoryName: state.editBrand?.groupCategoryName
                            }}
                            onFinish={onFinish}>
                            <Form.Item
                                label='Tên thể loại'
                                name='categoryName'
                                rules={[{ required: true, message: 'Please input your Category Name!' }]}>
                                <Input defaultValue={state.editBrand?.categoryName} placeholder='Tên thể loại' />
                            </Form.Item>
                            <Form.Item
                                label='Tên nhóm thể loại'
                                name='groupCategoryId'
                                rules={[{ required: true, message: 'Please input your Group Category Name!' }]}>
                                <Select
                                    placeholder='Select Option '
                                    defaultValue={state.editBrand?.groupCategoryName}
                                    onChange={e => changeGroupCategoryName(e)}>
                                    {state.groupcategorysList?.map(groupcategorys => {
                                        return (
                                            // eslint-disable-next-line react/jsx-key
                                            <Option value={groupcategorys.groupCategoryId}>
                                                {groupcategorys.groupCategoryName}
                                            </Option>
                                        )
                                    })}
                                </Select>
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
                        dataSource={state.dataCategory.length > 0 ? state.dataCategory : state.categorysList}
                    />
                </div>
            </div>
        </div>
    )
}

export default CategorysPage
