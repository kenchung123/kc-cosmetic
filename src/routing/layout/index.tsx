import React from 'react'
import { Route, Switch } from 'react-router'
import LoginPage from '../../pages/layout/login'
import HomePage from '../../pages/layout/home'
import BrandDetailPage from '../../pages/layout/brand-detail'
import RegisterPage from '../../pages/layout/register'
import CartPage from '../../pages/layout/cart'
import ProductDetailPage from '../../pages/layout/product-detail'
import CategoryDetailPage from '../../pages/layout/category-detail'
import ProfilePage from '../../pages/layout/profile'
import OrderPage from '../../pages/layout/order'
import ChangePasswordPage from '../../pages/layout/change-password'
import PaymentPage from '../../pages/layout/payment'
import FindProductPage from '../../pages/layout/find-product'
import OrderDetailPage from '../../pages/layout/order-detail'
const Routing = () => (
    <Switch>
        <Route path='/login' exact component={() => <LoginPage />} />
        <Route path='/' exact component={() => <HomePage />} />
        <Route path='/brand/:brandName/:brandId' exact component={() => <BrandDetailPage />} />
        <Route path='/register' exact component={() => <RegisterPage />} />
        <Route path='/cart' exact component={() => <CartPage />} />
        <Route path='/product/:productNameToSlug/:productId' exact component={() => <ProductDetailPage />} />
        <Route path='/category/:categoryName/:categoryId' exact component={() => <CategoryDetailPage />} />
        <Route path='/profile' exact component={() => <ProfilePage />} />
        <Route path='/order' exact component={() => <OrderPage />} />
        <Route path='/change-password' exact component={() => <ChangePasswordPage />} />
        <Route path='/payment' exact component={() => <PaymentPage />} />
        <Route path='/search' exact component={() => <FindProductPage />} />
        <Route path='/order/:orderId' exact component={() => <OrderDetailPage />} />
    </Switch>
)

export default Routing
