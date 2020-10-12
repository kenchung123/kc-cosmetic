import React, { useState, useEffect } from 'react'
import { Table, Input, Button, Modal, Form } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { showNotification } from '../../common/notification'
import GroupcategorysService from '../../services/admin/groupcategorys-service'

const GroupcategorysPage = () => {
    const [form] = Form.useForm()
    const [state, setState] = useState({
        searchText: '',
        searchedColumn: '',
        groupcategorysList: [],
        visible: false,
        actionStatus: '',
        editBrand: null,
        keyword: '',
        dataGroupcategorys: []
    })

    let groupcategorysList = []
    const fetchData = async () => {
        try {
            groupcategorysList = await GroupcategorysService.getGroupcategorys()
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, groupcategorysList }))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const showModal = (id: string) => {
        if (id) {
            const brand = state.groupcategorysList.find(p => p.groupCategoryId === id)
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
        const { groupcategorysList } = state
        if (state.actionStatus === 'Adding') form.resetFields()
        setState(s => ({
            ...s,
            groupcategorysList: [...groupcategorysList],
            visible: false,
            actionStatus: '',
            editBrand: {}
        }))
    }

    const columns = [
        {
            title: 'Mã nhóm thể loại',
            dataIndex: 'groupCategoryId',
            key: 'groupCategoryId'
        },
        {
            title: 'Tên nhóm thể loại',
            dataIndex: 'groupCategoryName',
            key: 'groupCategoryName',
            width: '20%'
        },
        {
            render: (record: any) => <DeleteOutlined onClick={() => deleteBrand(record.groupCategoryId)} />
        },
        {
            render: (record: any) => <EditOutlined onClick={() => showModal(record.groupCategoryId)} />
        }
    ]
    const deleteBrand = async (id: any) => {
        let { groupcategorysList } = state
        try {
            const deleteList = await GroupcategorysService.deleteGroupcategorys(id)
            if (deleteList.status === 200) {
                groupcategorysList = groupcategorysList.filter(x => x.groupCategoryId !== id)
                showNotification('success', '', 'Nhóm thể loại', 'xóa')
            } else {
                showNotification('error', deleteList.data?.message)
            }
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, groupcategorysList: groupcategorysList.filter(x => x.groupCategoryId !== id) }))
    }

    const onFinish = async values => {
        const { groupcategorysList, actionStatus } = state
        const param = values
        const id = state.editBrand?.groupCategoryId
        let addBrand = { data: { statusText: '' }, status: null }
        try {
            if (actionStatus === 'Adding') addBrand = await GroupcategorysService.addGroupcategorys(param)
            else {
                param['groupCategoryId'] = id
                addBrand = await GroupcategorysService.editGroupcategorys(param)
            }
            if (addBrand.status === 200) {
                showNotification('success', '', 'Nhóm thể loại', actionStatus === 'Adding' ? 'thêm' : 'cập nhật')
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
            groupcategorysList: [...groupcategorysList],
            editBrand: {},
            actionStatus: '',
            visible: false
        }))
    }

    // search
    const handleSearch = event => {
        if (event.target?.value) {
            state.keyword = event.target?.value
        } else setState(s => ({ ...s, keyword: '' }))
    }

    const changeText = () => {
        const { groupcategorysList, keyword } = state
        if (state.keyword) {
            const dataGroupcategorys = groupcategorysList.filter(g =>
                g.groupCategoryName?.toLowerCase().includes(keyword?.toLowerCase())
            )
            setState(s => ({ ...s, keyword, dataGroupcategorys: dataGroupcategorys }))
        } else {
            setState(s => ({ ...s, keyword, dataGroupcategorys: groupcategorysList }))
        }
    }
    // end search

    const { editBrand } = state
    return (
        <div className='box-brand'>
            <h1 className='mt-4'>Nhóm thể loại</h1>
            <ol className='breadcrumb mb-4'>
                <li className='breadcrumb-item active'>Nhóm thể loại</li>
            </ol>
            <div className='card mb-4'>
                <div className='card-header'>
                    <i className='fas fa-table mr-1' />
                    Danh sách nhóm thể loại
                </div>
                <div className='card-body'>
                    <Button className='mb-2 btn-add' type='primary' onClick={() => showModal(null)}>
                        Thêm
                    </Button>
                    <div className='box-search'>
                        <Input placeholder='Tìm nhóm thể loại' onChange={handleSearch} name='keyword'></Input>
                        <Button onClick={() => changeText()}>Tìm kiếm</Button>
                    </div>
                    <Modal
                        title={state.actionStatus === 'Adding' ? 'Thêm nhóm thể loại' : 'Sửa nhóm thể loại'}
                        visible={state.visible}
                        onCancel={handleCancel}>
                        <Form
                            form={form}
                            initialValues={{
                                groupCategoryName: state.editBrand?.groupCategoryName
                            }}
                            onFinish={onFinish}>
                            <Form.Item
                                label='Tên nhóm thể loại'
                                name='groupCategoryName'
                                rules={[{ required: true, message: 'Please input your groupCategoryName!' }]}>
                                <Input defaultValue={editBrand?.groupCategoryName} placeholder='Tên nhóm thể loại' />
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
                        dataSource={
                            state.dataGroupcategorys.length > 0 ? state.dataGroupcategorys : state.groupcategorysList
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default GroupcategorysPage
