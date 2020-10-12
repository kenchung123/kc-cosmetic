const RootAPI = 'https://heroku-cosmetic.herokuapp.com/api/v1'
const apiConstant = Object.freeze({
    // Login
    LoginUrl: `${RootAPI}/user/signin`,
    BrandURI: `${RootAPI}/brands`,
    GroupcategorysUrl: `${RootAPI}/groupcategorys`,
    CategorysUrl: `${RootAPI}/categorys`,
    ProductsUrl: `${RootAPI}/products`,
    OrderURI: `${RootAPI}/orders`,
    DetailOrderURI: `${RootAPI}/orderdetail`,
    UserURI: `${RootAPI}/user`
})

export default apiConstant
