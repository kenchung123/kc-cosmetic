import axios from 'axios'
import apiConstant from '../../configurations/layout/api-constants'

const UserService = {
    getUser: async () => {
        const resp = await axios.get(apiConstant.UserUrl)
        return resp.data
    },
    addUser: async (param: any) => {
        const resp = await axios.post(apiConstant.UserUrl, param)
        return resp
    },
    editUser: async (param: any) => {
        const dataLogin = JSON.parse(localStorage.getItem('dataLogin'))
        const token = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: dataLogin.data?.tokenType + ' ' + dataLogin.data?.accessToken
            }
        }
        const resp = await axios.put(apiConstant.UserUrl, param, token)
        return resp
    },
    detailUser: async (id: any) => {
        const resp = await axios.get(apiConstant.UserUrl + '/' + id)
        return resp.data
    }
}

export default UserService
