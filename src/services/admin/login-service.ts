import axios from 'axios'
import apiConstant from '../../configurations/admin/api-constants'

const LoginService = {
    login: async (param: any) => {
        const dataLogin = JSON.parse(localStorage.getItem('dataLogin'))
        const token = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: dataLogin.data?.tokenType + ' ' + dataLogin.data?.accessToken
            }
        }
        const resp = await axios.post(apiConstant.LoginUrl, param, token)
        return resp
    }
}

export default LoginService
