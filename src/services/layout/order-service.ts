import axios from 'axios'
import apiConstant from '../../configurations/layout/api-constants'

const OrderService = {
    getOrder: async () => {
        const resp = await axios.get(apiConstant.OrderURI)
        return resp.data
    },
    getOrderByUser: async () => {
        const dataLogin = JSON.parse(localStorage.getItem('dataLogin'))
        const token = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: dataLogin.data?.tokenType + ' ' + dataLogin.data?.accessToken
            }
        }
        const resp = await axios.get(apiConstant.OrderByUser, token)
        return resp.data
    },
    addOrder: async (param: any) => {
        const dataLogin = JSON.parse(localStorage.getItem('dataLogin'))
        const token = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: dataLogin.data?.tokenType + ' ' + dataLogin.data?.accessToken
            }
        }
        const resp = await axios.post(apiConstant.OrderURI, param, token)
        return resp
    },
    detailOrder: async (id: string) => {
        const dataLogin = JSON.parse(localStorage.getItem('dataLogin'))
        const token = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: dataLogin.data?.tokenType + ' ' + dataLogin.data?.accessToken
            }
        }
        const resp = await axios.get(apiConstant.detailOrder + '/' + id, token)
        return resp.data
    },
    listDetailOrder: async () => {
        const dataLogin = JSON.parse(localStorage.getItem('dataLogin'))
        const token = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: dataLogin.data?.tokenType + ' ' + dataLogin.data?.accessToken
            }
        }
        const resp = await axios.get(apiConstant.ListDetailOrder, token)
        return resp.data
    },
    statusOrder: async (id: any, status: number) => {
        const resp = await axios.put(apiConstant.OrderURI + '/' + id + '/' + status)
        return resp
    }
}

export default OrderService
