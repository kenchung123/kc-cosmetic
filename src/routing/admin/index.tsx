import React from 'react'
import { Route, Switch } from 'react-router'
import BrandPage from '../../pages/admin/brand'
import GroupcategorysPage from '../../pages/admin/groupcategorys'
import CategorysPage from '../../pages/admin/categorys'
import ProductsPage from '../../pages/admin/products'
import OrderPage from '../../pages/admin/order'
import UserPage from '../../pages/admin/user'
import LoginPage from '../../pages/admin/login'
import AdminPage from '../../pages/admin/admin'
const RoutingAdmin = () => (
    <Switch>
        <Route path='/admin/login' exact component={() => <LoginPage />} />
        <Route path='/admin' exact component={() => <BrandPage />} />
        <Route path='/admin/groupcategorys' exact component={() => <GroupcategorysPage />} />
        <Route path='/admin/categorys' exact component={() => <CategorysPage />} />
        <Route path='/admin/products' exact component={() => <ProductsPage />} />
        <Route path='/admin/orders' exact component={() => <OrderPage />} />
        <Route path='/admin/user' exact component={() => <UserPage />} />
        <Route path='/admin/infor' exact component={() => <AdminPage />} />
    </Switch>
)

export default RoutingAdmin
