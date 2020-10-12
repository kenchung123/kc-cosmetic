import axios from 'axios'
import apiConstant from '../../configurations/layout/api-constants'

const CategorysService = {
    getCategorys: async () => {
        const resp = await axios.get(apiConstant.CategorysUrl)
        return resp.data
    },
    detailCategorys: async (id: any) => {
        const resp = await axios.get(apiConstant.CategorysUrl + '/' + id)
        return resp.data
    },
    deleteCategorys: async (id: any) => {
        const resp = await axios.delete(apiConstant.CategorysUrl + '/' + id)
        return resp
    },
    addCategorys: async (param: any) => {
        const resp = await axios.post(apiConstant.CategorysUrl, param)
        return resp
    },
    editCategorys: async (id: string, param: any) => {
        const resp = await axios.put(apiConstant.CategorysUrl + '/' + id, param)
        return resp
    }
}

export default CategorysService
