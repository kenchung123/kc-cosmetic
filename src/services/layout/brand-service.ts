import axios from 'axios'
import apiConstant from '../../configurations/layout/api-constants'

const BrandService = {
    getBrand: async () => {
        const resp = await axios.get(apiConstant.BrandURI)
        return resp.data
    },
    detailBrand: async (id: any) => {
        const resp = await axios.get(apiConstant.BrandURI + '/' + id)
        return resp.data
    },
    deleteBrand: async (id: any) => {
        const resp = await axios.delete(apiConstant.BrandURI + '/' + id)
        return resp
    },
    addBrand: async (param: any) => {
        const resp = await axios.post(apiConstant.BrandURI, param)
        return resp
    },
    editBrand: async (id: string, param: any) => {
        const resp = await axios.put(apiConstant.BrandURI + '/' + id, param)
        return resp
    }
}

export default BrandService
