import React, { useState } from 'react'
import { Form, Input, Button, Select, DatePicker } from 'antd'
import UserService from '../../services/layout/user-service'
import { showNotification } from '../../common/notification'
import moment from 'moment'
const RegisterPage = () => {
    const [form] = Form.useForm()
    const { Option } = Select
    const [state, setState] = useState({
        userList: [],
        validate: false
    })

    const onChange = (date, dateString) => {
        console.log(date, dateString)
    }
    localStorage.removeItem('status')

    const onFinish = async values => {
        const { userList } = state
        const param = values
        param['birthDate'] = moment(values.birthDate).format('YYYY-MM-DD')
        let addUser = null
        try {
            addUser = await UserService.addUser(param)
            localStorage.setItem('dataUser', JSON.stringify(addUser.data))
            if (addUser.status === 200) {
                setState(s => ({ ...s, userList: [...userList], validate: false }))
            } else {
                showNotification('error', addUser.data?.statusText)
            }
        } catch (error) {
            setState(s => ({ ...s, validate: true }))
        }
        form.resetFields()
        window.location.href = '/'
        setState(s => ({ ...s, userList: [...userList] }))
    }

    return (
        <div>
            <section className='breadcrumb-area'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='breadcrumbs text-center'>
                                <h1>Đăng Ký</h1>
                                <h4>Chào mừng bạn đến với cửa hàng trực tuyến của chúng tôi.</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='breadcrumb-bottom-area'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-lg-8 col-md-5 col-sm-5'>
                                <ul>
                                    <li>
                                        <a href='#'>Trang chủ</a>
                                    </li>
                                    <li>
                                        <a href='#'>
                                            <i className='fa fa-angle-right' />
                                        </a>
                                    </li>
                                    <li>Đăng ký</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className='account_page'>
                <div className='container'>
                    <div className='register_form' style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                        <div className='theme-title'>
                            <h2>Đăng ký tại đây</h2>
                        </div>
                        <Form form={form} onFinish={onFinish}>
                            <Form.Item
                                label='Tên đăng nhập'
                                name='fullName'
                                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập của bạn!' }]}>
                                <Input defaultValue='' placeholder='Nhập tên đăng nhập' />
                            </Form.Item>

                            <Form.Item
                                label='Mật khẩu'
                                name='password'
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}>
                                <Input.Password defaultValue='' placeholder='Nhập mật khẩu' />
                            </Form.Item>
                            <Form.Item
                                label='Số điện thoại'
                                name='phoneNumber'
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại của bạn!' },
                                    { max: 10 }
                                ]}>
                                <Input defaultValue='' placeholder='Nhập số điện thoại' />
                            </Form.Item>
                            <Form.Item
                                label='Địa chỉ Email'
                                name='email'
                                rules={[
                                    { required: true, message: 'Vui lòng nhập địa chỉ Email của bạn!' },
                                    {
                                        type: 'email',
                                        message: 'Email của bạn không hợp lệ!'
                                    }
                                ]}>
                                <Input defaultValue='' placeholder='Nhập địa chỉ Email' />
                            </Form.Item>
                            <Form.Item
                                label='Địa chỉ'
                                name='address'
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ của bạn!' }]}>
                                <Input defaultValue='' placeholder='Nhập địa chỉ' />
                            </Form.Item>
                            <Form.Item
                                label='Giới tính'
                                name='gender'
                                rules={[{ required: true, message: 'Vui lòng nhập giới tính của bạn!' }]}>
                                <Select placeholder='Chọn giới tính'>
                                    <Option value='Nam'>Nam</Option>
                                    <Option value='Nữ'>Nữ</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label='Ngày sinh'
                                name='birthDate'
                                rules={[{ required: true, message: 'Vui lòng nhập ngày sinh của bạn!' }]}>
                                <DatePicker onChange={onChange} />
                            </Form.Item>
                            {state.validate && <span className='style-validate'>Email của bạn đã tồn tại !</span>}
                            <div className='btn-action'>
                                <Button type='primary' htmlType='submit'>
                                    Tạo tài khoản
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
                {/* End of .row */}
            </div>
            {/* End of .container */}
        </div>
    )
}

export default RegisterPage
