import React, { useState, useEffect } from 'react'
import { Form, Input, Button, DatePicker, Row, Col, Radio, Upload, message, Spin } from 'antd'
import noImage from '../../static/layout/images/no-image.jpg'
import { LoadingOutlined } from '@ant-design/icons'
import UserService from '../../services/layout/user-service'
import moment from 'moment'
const ProfilePage = () => {
    const [form] = Form.useForm()
    const [state, setState] = useState({
        imageUrl: '',
        loading: false,
        imageUser: '',
        updateUser: null,
        detailUser: null,
        editUser: null,
        validate: false
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
        setState(s => ({ ...s, detailUser }))
    }

    useEffect(() => {
        fetchData()
    }, [])
    localStorage.removeItem('status')

    useEffect(() => {
        form.setFieldsValue({
            fullName: state.detailUser?.fullName,
            email: state.detailUser?.email,
            phoneNumber: state.detailUser?.phoneNumber,
            birthDate: state.detailUser?.birthDate,
            gender: state.detailUser?.gender,
            address: state.detailUser?.address,
            imageProfile: state.detailUser?.imageProfile
        })
    }, [state])

    function getBase64(img, callback) {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
    }

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setState(s => ({ ...s, loading: true }))
            return
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl =>
                setState(s => ({ ...s, imageUrl, imageUser: info.file.name, loading: false }))
            )
        }
    }

    let updateUser = null
    const onFinish = async values => {
        const param = values
        param['imageProfile'] = state.imageUser
        param['userId'] = state.detailUser.userId
        param['birthDate'] = moment(state.detailUser.birthDate).format('YYYY-MM-DD')
        param['password'] = state.detailUser.password
        try {
            updateUser = await UserService.editUser(param)
            if (updateUser.status === 200) {
                message.success('Cập nhật tài khoản thành công')
                setState(s => ({ ...s, validate: false }))
                window.location.reload()
            } else {
                setState(s => ({ ...s, validate: true }))
            }
        } catch (error) {
            setState(s => ({ ...s, validate: true }))
        }
        setState(s => ({ ...s, detailUser: updateUser?.data }))
    }

    return (
        <div className='content'>
            <h4>Hồ Sơ Của Tôi</h4>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            <Row>
                <Col span={18}>
                    <Form form={form} onFinish={onFinish} name='basic'>
                        <Form.Item name='fullName' label='Tên Đăng Nhập'>
                            <Input defaultValue={state.detailUser?.fullName} placeholder='Nhập tên đăng nhập' />
                        </Form.Item>
                        <Form.Item
                            label='Email'
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!'
                                }
                            ]}
                            name='email'>
                            <Input defaultValue={state.detailUser?.email} placeholder='Nhập email' />
                        </Form.Item>
                        <Form.Item label='Số Điện Thoại' name='phoneNumber'>
                            <Input defaultValue={state.detailUser?.phoneNumber} placeholder='Nhập số điện thoại' />
                        </Form.Item>
                        <Form.Item label='Địa Chỉ' name='address'>
                            <Input defaultValue={state.detailUser?.address} placeholder='Nhập địa chỉ' />
                        </Form.Item>
                        <Form.Item label='Ngày Sinh' name='birthdate'>
                            <DatePicker defaultValue={moment(state.detailUser?.birthDate)} />
                        </Form.Item>
                        <Form.Item label='Giới Tính' name='gender'>
                            <Radio.Group defaultValue={state.detailUser?.gender}>
                                <Radio value='Nam'>Nam</Radio>
                                <Radio value='Nữ'>Nữ</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {state.validate && (
                            <span style={{ color: '#F44336', marginLeft: '140px' }}>Email đã tồn tại !</span>
                        )}
                        <div className='btn-action'>
                            <Button type='primary' htmlType='submit'>
                                Lưu
                            </Button>
                        </div>
                    </Form>
                </Col>
                <Col span={6}>
                    <div className='box-upload'>
                        {state.loading ? (
                            <LoadingOutlined />
                        ) : (
                            <img
                                src={
                                    state.imageUrl ||
                                    `http://localhost:8080/uploads/images/${state.detailUser?.imageProfile}` ||
                                    noImage
                                }
                            />
                        )}
                    </div>
                    <Upload
                        name='imageProfile'
                        listType='picture-card'
                        className='avatar-uploader'
                        showUploadList={false}
                        action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                        onChange={handleChange}>
                        <div>
                            <div className='ant-upload-text'>Chọn Ảnh</div>
                        </div>
                    </Upload>
                </Col>
            </Row>
        </div>
    )
}

export default ProfilePage
