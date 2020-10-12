import axios from 'axios'
import apiConstant from '../../configurations/admin/api-constants'

const UserService = {
    getUser: async () => {
        const resp = await axios.get(apiConstant.UserURI)
        return resp.data
    },
    deleteUser: async (id: any) => {
        const resp = await axios.delete(apiConstant.UserURI + '/' + id)
        return resp
    }
}

export default UserService
