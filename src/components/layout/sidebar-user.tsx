import React, { useState, useEffect, Fragment } from 'react'
import noImage from '../../static/layout/images/no-image.jpg'
import { Link } from 'react-router-dom'
import UserService from '../../services/layout/user-service'
const SidebarUserPage = () => {
    const [state, setState] = useState({
        imageUrl: '',
        loading: false,
        imageUser: '',
        updateUser: null,
        detailUser: null,
        editUser: null
    })
    const dataUser = localStorage.getItem('dataUser')
    const idUser = JSON.parse(dataUser)?.userId
    const idLogin = JSON.parse(localStorage.getItem('infoUser'))?.userId
    let detailUser = null
    const fetchData = async () => {
        try {
            detailUser = await UserService.detailUser(idUser || idLogin)
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, detailUser }))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const reLoad = () => {
        setTimeout(() => {
            window.location.reload()
        }, 500)
    }

    return (
        <Fragment>
            <div className='info-user'>
                <img src={`http://localhost:8080/uploads/images/${state.detailUser?.imageProfile}` || noImage} />
                <span>{state.detailUser?.fullName}</span>
            </div>
            <div className='menu-info'>
                <span className='icon'>
                    <i className='far fa-user'></i>
                </span>
                Tài khoản Của Tôi
                <div className='sub-info'>
                    <p>
                        <Link to='/profile' onClick={() => reLoad()}>
                            Hồ Sơ
                        </Link>
                    </p>
                    <p>
                        <Link to='/change-password' onClick={() => reLoad()}>
                            Đổi Mật Khẩu
                        </Link>
                    </p>
                </div>
                <span className='icon box-icon'>
                    <i className='fas fa-align-left'></i>
                </span>
                <Link to='/order' onClick={() => reLoad()}>
                    Đơn Mua
                </Link>
            </div>
        </Fragment>
    )
}

export default SidebarUserPage
