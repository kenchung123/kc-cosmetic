import axios from 'axios'
import apiConstant from '../../configurations/admin/api-constants'

const ProductsService = {
    getProducts: async () => {
        const resp = await axios.get(apiConstant.ProductsUrl)
        return resp.data
    },
    deleteProducts: async (id: any) => {
        const resp = await axios.delete(apiConstant.ProductsUrl + '/' + id)
        return resp
    },
    addProducts: async (param: any) => {
        const resp = await axios.post(apiConstant.ProductsUrl, param)
        return resp
    },
    editProducts: async (param: any) => {
        const resp = await axios.put(apiConstant.ProductsUrl, param)
        return resp
    }
}

export default ProductsService
