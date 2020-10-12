import axios from 'axios'
import apiConstant from '../../configurations/layout/api-constants'

const CartService = {
    getCart: async (userId: string) => {
        const resp = await axios.get(apiConstant.CartURI + '/' + userId)
        return resp.data
    },
    updateQuantity: async (cartId: number, quantity: number) => {
        const resp = await axios.put(apiConstant.CartURI + '/' + cartId + '/' + quantity)
        return resp
    },
    addCart: async (productId: number, quantity: number) => {
        const dataLogin = JSON.parse(localStorage.getItem('dataLogin'))
        const token = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: dataLogin.data?.tokenType + ' ' + dataLogin.data?.accessToken
            }
        }
        const resp = await axios.post(apiConstant.CartURI + '/' + productId + '/' + quantity, '', token)
        return resp
    },
    deleteCart: async (cartId: any) => {
        const resp = await axios.delete(apiConstant.CartURI + '/' + cartId)
        return resp
    },
    deleteAllCart: async () => {
        const resp = await axios.delete(apiConstant.CartURI)
        return resp
    }
}

export default CartService
