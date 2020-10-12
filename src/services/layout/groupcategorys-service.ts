import axios from 'axios'
import apiConstant from '../../configurations/layout/api-constants'

const GroupcategorysService = {
    getGroupcategorys: async () => {
        const resp = await axios.get(apiConstant.GroupcategorysUrl)
        return resp.data
    },
    deleteGroupcategorys: async (id: any) => {
        const resp = await axios.delete(apiConstant.GroupcategorysUrl + '/' + id)
        return resp
    },
    addGroupcategorys: async (param: any) => {
        const resp = await axios.post(apiConstant.GroupcategorysUrl, param)
        return resp
    },
    editGroupcategorys: async (id: string, param: any) => {
        const resp = await axios.put(apiConstant.GroupcategorysUrl + '/' + id, param)
        return resp
    }
}

export default GroupcategorysService
