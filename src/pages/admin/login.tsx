import React, { useState, useEffect } from 'react'
import { Input, Button, Form } from 'antd'
import UserService from '../../services/admin/user-service'
import LoginService from '../../services/admin/login-service'

const LoginPage = () => {
    const [form] = Form.useForm()
    const [state, setState] = useState({
        dataLogin: null,
        validate: false,
        dataUser: []
    })

    let dataUser = []
    const fetchData = async () => {
        try {
            dataUser = await UserService.getUser()
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, dataUser }))
    }

    useEffect(() => {
        fetchData()
    }, [])

    let dataLogin = null
    const onFinish = async values => {
        const param = values
        const localStorageLogin = state.dataUser.find(user => user.email === param.email)
        localStorage.setItem('infoUser', JSON.stringify(localStorageLogin))
        try {
            dataLogin = await LoginService.login(param)
            localStorage.setItem('dataLogin', JSON.stringify(dataLogin.data))
            const statusLogin = dataLogin.status === 200 && dataLogin.data?.data?.roleName === 'ROLE_ADMIN'
            localStorage.setItem('checkLogin', JSON.stringify(statusLogin))
            if (statusLogin) {
                window.location.href = '/admin'
                setState(s => ({ ...s, validate: false }))
            } else {
                setState(s => ({ ...s, validate: true }))
            }
        } catch (error) {
            setState(s => ({ ...s, validate: true }))
        }
        setState(s => ({ ...s, dataLogin }))
    }
    return (
        <div id='layoutAuthentication'>
            <div id='layoutAuthentication_content'>
                <main>
                    <div className='container login-admin'>
                        <div className='row justify-content-center'>
                            <div className='col-lg-5'>
                                <div className='card shadow-lg border-0 rounded-lg mt-5'>
                                    <div className='card-header'>
                                        <h3 className='text-center font-weight-light my-4'>Đăng nhập</h3>
                                    </div>
                                    <div className='card-body'>
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
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }
                                                ]}>
                                                <Input.Password defaultValue='' placeholder='Nhập mật khẩu' />
                                            </Form.Item>
                                            {state.validate && (
                                                <span className='style-validate'>
                                                    Email hoặc mật khẩu của bạn không đúng !
                                                </span>
                                            )}
                                            <div className='btn-action' style={{ marginBottom: '10px' }}>
                                                <Button type='primary' htmlType='submit'>
                                                    Đăng nhập ngay
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <div id='layoutAuthentication_footer'>
                <footer className='py-4 bg-light mt-auto'>
                    <div className='container-fluid'>
                        <div className='d-flex align-items-center justify-content-between small'>
                            <div className='text-muted'>Copyright © Your Website 2019</div>
                            <div>
                                <a href='#'>Privacy Policy</a>·<a href='#'>Terms &amp; Conditions</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default LoginPage
