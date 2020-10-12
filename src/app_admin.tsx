import React from 'react'
import { Layout } from 'antd'
import Routing from './routing/admin'
import AppHeaderAdmin from './components/admin/header'
import AppFooterAdmin from './components/admin/footer'
import 'antd/lib/row/style/css'
import 'antd/lib/col/style/css'
import 'antd/lib/table/style/css'
import 'antd/dist/antd.css'
import './app.css'
import 'bootstrap/dist/css/bootstrap.css'
import '../src/style/admin/main.scss'
// require('./static/favicon.ico')

const { Content } = Layout

const App = () => {
    const checkLogin = JSON.parse(localStorage.getItem('checkLogin'))
    if (location.pathname.includes('/admin/login')) {
        return (
            <body className='bg-primary'>
                <Content>
                    <Routing />
                </Content>
            </body>
        )
    } else if(location.pathname.includes('/admin')) {
        return (
            checkLogin ? (<body className='sb-nav-fixed'>
                <AppHeaderAdmin />
                <div id='layoutSidenav'>
                    <div id='layoutSidenav_nav'>
                        <nav className='sb-sidenav accordion sb-sidenav-dark' id='sidenavAccordion'>
                            <div className='sb-sidenav-menu'>
                                <div className='nav'>
                                    <div className='sb-sidenav-menu-heading'></div>
                                    <a className='nav-link' href='/'>
                                        <div className='sb-nav-link-icon'>
                                            <i className='fas fa-asterisk'></i>
                                        </div>
                                        Thương hiệu
                                    </a>
                                    <a className='nav-link' href='/admin/categorys'>
                                        <div className='sb-nav-link-icon'>
                                            <i className='fas fa-table' />
                                        </div>
                                        Thể loại
                                    </a>
                                    <a className='nav-link' href='/admin/groupcategorys'>
                                        <div className='sb-nav-link-icon'>
                                            <i className='fas fa-th-list'></i>
                                        </div>
                                        Nhóm thể loại
                                    </a>
                                    <a className='nav-link' href='/admin/products'>
                                        <div className='sb-nav-link-icon'>
                                            <i className='fas fa-list-ul'></i>
                                        </div>
                                        Sản phẩm
                                    </a>
                                    <a className='nav-link' href='/admin/orders'>
                                        <div className='sb-nav-link-icon'>
                                            <i className='far fa-address-card'></i>
                                        </div>
                                        Đơn hàng
                                    </a>
                                    <a className='nav-link' href='/admin/user'>
                                        <div className='sb-nav-link-icon'>
                                            <i className='fas fa-user-friends'></i>
                                        </div>
                                        Khách hàng
                                    </a>
                                </div>
                            </div>
                            {/* <div className='sb-sidenav-footer'>
                                <div className='small'>Logged in as:</div>
                                Start Bootstrap
                            </div> */}
                        </nav>
                    </div>
                    <div id='layoutSidenav_content'>
                        <main>
                            <div className='container-fluid'>
                                <Content>
                                    <Routing />
                                </Content>
                            </div>
                        </main>
                    </div>
                </div>
                <AppFooterAdmin />
            </body>
        ) : (
            (window.location.href = '/admin/login')
        )
        )
    }
}

export default App
