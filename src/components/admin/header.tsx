import React from 'react'
import logo from '../../static/admin/images/logo3.png'
const AppHeaderAdmin = () => {
    const loadPage = () => {
        localStorage.removeItem('infoUser')
        localStorage.removeItem('checkLogin')
    }
    const dataLogin = JSON.parse(localStorage.getItem('infoUser'))
    return (
        <nav className='sb-topnav navbar navbar-expand navbar-dark bg-dark'>
            <a href='/'>
                <img style={{ padding: '10px', width: '200px', marginTop: '20px' }} src={logo} />
            </a>
            <div className='box-menu'>
                <span>Chào, {dataLogin.fullName}</span>
                <ul className='navbar-nav ml-auto ml-md-0'>
                    <li className='nav-item dropdown'>
                        <a
                            className='nav-link dropdown-toggle'
                            id='userDropdown'
                            href='#'
                            role='button'
                            data-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='false'>
                            <i className='fas fa-user fa-fw' />
                        </a>
                        <div className='dropdown-menu dropdown-menu-right' aria-labelledby='userDropdown'>
                            <a className='dropdown-item' href='/admin/login' onClick={() => loadPage()}>
                                Đăng xuất
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default AppHeaderAdmin
