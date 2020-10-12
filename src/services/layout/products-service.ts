import axios from 'axios'
import apiConstant from '../../configurations/layout/api-constants'

const ProductsService = {
    getProducts: async () => {
        const resp = await axios.get(apiConstant.ProductsUrl)
        return resp.data
    },
    detailProducts: async (id: any) => {
        const resp = await axios.get(apiConstant.ProductsUrl + '/' + id)
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
    editProducts: async (id: string, param: any) => {
        const resp = await axios.put(apiConstant.ProductsUrl + '/' + id, param)
        return resp
    },
    findProduct: async (value: any) => {
        const resp = await axios.get(apiConstant.findProduct + '?keySearch=' + value)
        return resp.data
    }
}

export default ProductsService
