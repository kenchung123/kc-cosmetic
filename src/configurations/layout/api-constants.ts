const RootAPI = 'https://heroku-cosmetic.herokuapp.com/api/v1'
const apiConstant = Object.freeze({
    // Login
    LoginUrl: `${RootAPI}/user/signin`,
    BrandURI: `${RootAPI}/brands`,
    GroupcategorysUrl: `${RootAPI}/groupcategorys`,
    CategorysUrl: `${RootAPI}/categorys`,
    ProductsUrl: `${RootAPI}/products`,
    UserUrl: `${RootAPI}/user`,
    ChangePassword: `${RootAPI}/user/password-reset`,
    OrderURI: `${RootAPI}/orders`,
    CartURI: `${RootAPI}/cart`,
    OrderByUser: `${RootAPI}/orders/get-order-by-user`,
    detailOrder: `${RootAPI}/orderdetail`,
    findProduct: `${RootAPI}/products/search`,
    ListDetailOrder: `${RootAPI}/orderdetail/get-order-detail-by-userId`
})

export default apiConstant
