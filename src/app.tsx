import React, { Fragment } from 'react'
import { Layout, Row, Col } from 'antd'
import Routing from './routing/layout'
import AppHeader from './components/layout/header'
import AppFooter from './components/layout/footer'
import RoutingAdmin from './routing/admin'
import AppHeaderAdmin from './components/admin/header'
import AppFooterAdmin from './components/admin/footer'
import 'antd/lib/row/style/css'
import 'antd/lib/col/style/css'
import 'antd/lib/table/style/css'
import 'antd/dist/antd.css'
import './app.css'
import 'bootstrap/dist/css/bootstrap.css'
import '../src/style/layout/main.scss'
import '../src/style/admin/main.scss'
// import Sidebar from './components/layout/sidebar'
import SidebarUserPage from './components/layout/sidebar-user'
// require('./static/layout/vicon.ico')

const { Content } = Layout

const App = () => {
    const checkLogin = JSON.parse(localStorage.getItem('checkLogin'))
    const dataLogin = JSON.parse(localStorage.getItem('infoUser'))
    if (location.pathname.includes('/admin/login')) {
        return (
            <body className='bg-primary'>
                <Content>
                    <RoutingAdmin />
                </Content>
            </body>
        )
    } else if (location.pathname.includes('/admin')) {
        return checkLogin && dataLogin?.roleId === 2 ? (
            <body className='sb-nav-fixed'>
                <AppHeaderAdmin />
                <div id='layoutSidenav'>
                    <div id='layoutSidenav_nav'>
                        <nav className='sb-sidenav accordion sb-sidenav-dark' id='sidenavAccordion'>
                            <div className='sb-sidenav-menu'>
                                <div className='nav'>
                                    <div className='sb-sidenav-menu-heading'></div>
                                    <a className='nav-link' href='/admin'>
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
                                    <a className='nav-link' href='/admin/infor'>
                                        <div className='sb-nav-link-icon'>
                                            <i className='far fa-user'></i>
                                        </div>
                                        Người quản lý
                                    </a>
                                </div>
                            </div>
                        </nav>
                    </div>
                    <div id='layoutSidenav_content'>
                        <main>
                            <div className='container-fluid'>
                                <Content>
                                    <RoutingAdmin />
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
    }
    //layout
    if (location.pathname.includes('/login')) {
        return (
            <Fragment>
                <AppHeader />
                <Content>
                    <Routing />
                </Content>
                <AppFooter />
            </Fragment>
        )
    } else if (location.pathname.includes('/product/detail')) {
        return (
            <Fragment>
                <AppHeader />
                <Content>
                    <Routing />
                </Content>
                <AppFooter />
            </Fragment>
        )
    } else if (location.pathname.includes('/payment')) {
        return (
            <Fragment>
                <AppHeader />
                <Content>
                    <Routing />
                </Content>
                <AppFooter />
            </Fragment>
        )
    } else if (location.pathname.includes('/register')) {
        return (
            <Fragment>
                <AppHeader />
                <Content>
                    <Routing />
                </Content>
                <AppFooter />
            </Fragment>
        )
    } else if (location.pathname.includes('/cart')) {
        return (
            <Fragment>
                <AppHeader />
                <Content>
                    <Routing />
                </Content>
                <AppFooter />
            </Fragment>
        )
    } else if (location.pathname.includes('/order')) {
        return (
            <Fragment>
                <AppHeader />
                <div className='box-container box-main'>
                    <Row>
                        <Col span={4}>
                            <SidebarUserPage />
                        </Col>
                        <Col span={20}>
                            <Content>
                                <Routing />
                            </Content>
                        </Col>
                    </Row>
                </div>
                <AppFooter />
            </Fragment>
        )
    } else if (location.pathname.includes('/change-password')) {
        return (
            <Fragment>
                <AppHeader />
                <div className='box-container box-main'>
                    <Row>
                        <Col span={4}>
                            <SidebarUserPage />
                        </Col>
                        <Col span={20}>
                            <Content>
                                <Routing />
                            </Content>
                        </Col>
                    </Row>
                </div>
                <AppFooter />
            </Fragment>
        )
    } else if (location.pathname.includes('/profile')) {
        return (
            <Fragment>
                <AppHeader />
                <div className='box-container box-main'>
                    <Row>
                        <Col span={4}>
                            <SidebarUserPage />
                        </Col>
                        <Col span={20}>
                            <Content>
                                <Routing />
                            </Content>
                        </Col>
                    </Row>
                </div>
                <AppFooter />
            </Fragment>
        )
    } else if (location.pathname.includes('/login')) {
        return (
            <Fragment>
                <AppHeader />
                <Content>
                    <Routing />
                </Content>
                <AppFooter />
            </Fragment>
        )
    } else {
        return (
            <div>
                <Routing />
            </div>
        )
    }
}

export default App
