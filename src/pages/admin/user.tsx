import React, { useState, useEffect } from 'react'
import { Table, Input, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { showNotification } from '../../common/notification'
import UserService from '../../services/admin/user-service'
const UserPage = () => {
    const [state, setState] = useState({
        searchText: '',
        searchedColumn: '',
        userList: [],
        visible: false,
        actionStatus: '',
        editOrder: null,
        orderDetail: [],
        dataUser: [],
        keyword: ''
    })

    let userList = []
    const fetchData = async () => {
        try {
            userList = await UserService.getUser()
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, userList: userList?.filter(x => x.roleId === 1) }))
    }

    const deleteUser = async (id: any) => {
        let { userList } = state
        try {
            const deleteList = await UserService.deleteUser(id)
            if (deleteList.status === 200) {
                userList = userList.filter(x => x.userId !== id)
                showNotification('success', '', 'Khách hàng', 'xóa')
            } else {
                showNotification('error', deleteList.data?.message)
            }
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, userList: userList.filter(x => x.userId !== id) }))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const columns = [
        {
            title: 'Mã khách hàng',
            dataIndex: 'userId',
            key: 'userId'
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'fullName',
            key: 'fullName',
            width: '20%'
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber'
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthDate',
            key: 'birthDate'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender'
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address'
        },
        {
            render: (record: any) => <DeleteOutlined onClick={() => deleteUser(record.userId)} />
        }
    ]

    // search
    const handleSearch = event => {
        if (event.target?.value) {
            state.keyword = event.target?.value
        } else setState(s => ({ ...s, keyword: '' }))
    }

    const changeText = () => {
        const { userList, keyword } = state
        if (state.keyword) {
            const dataUser = userList.filter(g => g.fullName?.toLowerCase().includes(keyword?.toLowerCase()))
            setState(s => ({ ...s, keyword, dataUser: dataUser }))
        } else {
            setState(s => ({ ...s, keyword, dataUser: userList }))
        }
    }
    // end search

    return (
        <div className='box-user'>
            <h1 className='mt-4'>Khách hàng</h1>
            <ol className='breadcrumb mb-4'>
                <li className='breadcrumb-item active'>Khách hàng</li>
            </ol>
            <div className='card mb-4'>
                <div className='card-header'>
                    <i className='fas fa-table mr-1' />
                    Danh sách hách hàng
                </div>
                <div className='card-body'>
                    <div className='box-search' style={{ marginBottom: '20px' }}>
                        <Input placeholder='Tìm khách hàng' onChange={handleSearch} name='keyword'></Input>
                        <Button onClick={() => changeText()}>Tìm kiếm</Button>
                    </div>
                    <Table columns={columns} dataSource={state.dataUser.length > 0 ? state.dataUser : state.userList} />
                </div>
            </div>
        </div>
    )
}

export default UserPage
