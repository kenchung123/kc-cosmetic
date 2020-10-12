import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Row, Col, message, Spin } from 'antd'
import { showNotification } from '../../common/notification'
import LoginService from '../../services/layout/login-service'
import UserService from '../../services/layout/user-service'
const ChangePasswordPage = () => {
    const [form] = Form.useForm()
    const [state, setState] = useState({
        changePassword: null,
        validate: false,
        detailUser: null,
        loading: true
    })

    const dataUser = localStorage.getItem('dataUser')
    const idUser = JSON.parse(dataUser)?.userId
    const idLogin = JSON.parse(localStorage.getItem('infoUser'))?.userId

    let detailUser = null
    const fetchData = async () => {
        try {
            detailUser = await UserService.detailUser(idUser || idLogin)
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, detailUser, loading: false }))
    }

    useEffect(() => {
        if (state.loading) {
            fetchData()
        }
    }, [])

    if (state.loading) {
        return <Spin />
    }
    localStorage.removeItem('status')

    let changePassword = null
    const onFinish = async values => {
        const param = {
            email: state.detailUser?.email,
            newPassword: values.newPassword,
            oldPassword: values.oldPassword
        }
        try {
            if (values.confirmPassword === values.newPassword) {
                changePassword = await LoginService.changePassword(param)
                if (changePassword.status === 200) {
                    message.success('Cập nhật mật khẩu thành công')
                    setState(s => ({ ...s, validate: false }))
                } else {
                    showNotification('error', changePassword.data?.statusText)
                }
            } else setState(s => ({ ...s, validate: true }))
        } catch (error) {
            console.log(error, 'error')
            setState(s => ({ ...s, validate: true }))
        }
    }

    return (
        <div className='content'>
            <h4>Đổi Mật Khẩu</h4>
            <p>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
            <Row>
                <Col span={18}>
                    <Form form={form} onFinish={onFinish}>
                        <Form.Item
                            label='Mật Khẩu Hiện Tại
'
                            name='oldPassword'>
                            <Input.Password
                                defaultValue=''
                                placeholder='Nhập Mật Khẩu Hiện Tại
'
                            />
                        </Form.Item>
                        <Form.Item
                            label='Mật Khẩu Mới
'
                            name='newPassword'>
                            <Input.Password
                                defaultValue=''
                                placeholder='Nhập Mật Khẩu Mới
'
                            />
                        </Form.Item>
                        <Form.Item label='Xác Nhận Mật Khẩu' name='confirmPassword'>
                            <Input.Password defaultValue='' placeholder='Nhập Lại Mật Khẩu Mới' />
                        </Form.Item>
                        {state.validate && (
                            <span style={{ color: '#F44336', marginLeft: '140px' }}>Mật khẩu không hợp lệ !</span>
                        )}
                        <div className='btn-action'>
                            <Button type='primary' htmlType='submit'>
                                Xác Nhận
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default ChangePasswordPage
