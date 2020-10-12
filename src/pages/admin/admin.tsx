import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import UserService from '../../services/admin/user-service'
const AdminPage = () => {
    const [state, setState] = useState({
        userList: []
    })

    let userList = []
    const fetchData = async () => {
        try {
            userList = await UserService.getUser()
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, userList: userList?.filter(x => x.roleId === 2) }))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const columns = [
        {
            title: 'Tên người quản lý',
            dataIndex: 'fullName',
            key: 'fullName',
            width: '15%'
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
            key: 'address',
            width: '25%'
        }
    ]

    return (
        <div className='box-user'>
            <h1 className='mt-4'>Người quản lý</h1>
            <ol className='breadcrumb mb-4'>
                <li className='breadcrumb-item active'>Người quản lý</li>
            </ol>
            <div className='card mb-4'>
                <div className='card-header'>
                    <i className='fas fa-table mr-1' />
                    Thông tin người quản lý
                </div>
                <div className='card-body'>
                    <Table columns={columns} dataSource={state.userList} />
                </div>
            </div>
        </div>
    )
}

export default AdminPage
