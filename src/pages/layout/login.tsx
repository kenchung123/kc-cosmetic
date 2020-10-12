import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Spin } from 'antd'
import { showNotification } from '../../common/notification'
import LoginService from '../../services/layout/login-service'
import UserService from '../../services/layout/user-service'
const LoginPage = () => {
    const [form] = Form.useForm()
    const [state, setState] = useState({
        dataLogin: null,
        validate: false,
        dataUser: [],
        loading: true
    })

    let dataUser = []
    const fetchData = async () => {
        try {
            dataUser = await UserService.getUser()
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, dataUser, loading: false }))
    }

    useEffect(() => {
        if (state.loading) {
            fetchData()
        }
    }, [])

    if (state.loading) {
        return <Spin />
    }

    localStorage.removeItem('dataUser')
    // localStorage.removeItem('status')

    let dataLogin = null
    const onFinish = async values => {
        const param = values
        const localStorageLogin = state.dataUser.find(user => user.email === param.email)
        localStorage.setItem('infoUser', JSON.stringify(localStorageLogin))
        try {
            dataLogin = await LoginService.login(param)
            localStorage.setItem('dataLogin', JSON.stringify(dataLogin.data))
            if (dataLogin.status === 200) {
                window.location.href = '/'
                setState(s => ({ ...s, validate: false }))
            } else {
                showNotification('error', dataLogin.data?.statusText)
            }
        } catch (error) {
            setState(s => ({ ...s, validate: true }))
        }
        setState(s => ({ ...s, dataLogin }))
    }
    return (
        <div>
            <div className='account_page box-login'>
                <div className='container'>
                    <div
                        className='login_form login__respon'
                        style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                        <div className='theme-title' style={{ textAlign: 'center' }}>
                            <h2>Đăng nhập ngay bây giờ</h2>
                        </div>
                        <Form form={form} onFinish={onFinish}>
                            <Form.Item
                                label='Email đăng nhâp'
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email của bạn!' },
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!'
                                    }
                                ]}
                                name='email'>
                                <Input defaultValue='' placeholder='Nhập tên tài khoản' />
                            </Form.Item>
                            <Form.Item
                                label='Mật khẩu'
                                name='password'
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}>
                                <Input.Password defaultValue='' placeholder='Nhập mật khẩu' />
                            </Form.Item>
                            {state.validate && (
                                <span className='style-validate'>Email hoặc mật khẩu của bạn không đúng !</span>
                            )}
                            <div className='btn-action'>
                                <Button type='primary' htmlType='submit'>
                                    Đăng nhập ngay
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
