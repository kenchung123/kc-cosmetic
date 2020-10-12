import axios from 'axios'
import apiConstant from '../../configurations/admin/api-constants'

const OrderService = {
    getOrder: async () => {
        const resp = await axios.get(apiConstant.OrderURI)
        return resp.data
    },
    detailOrder: async (id: any) => {
        const resp = await axios.get(apiConstant.DetailOrderURI + '/' + id)
        return resp.data
    },
    statusOrder: async (id: any,status: number) => {
        const resp = await axios.put(apiConstant.OrderURI + '/' + id + '/' + status)
        return resp
    }
}

export default OrderService
