import { notification } from 'antd'

export const showNotification = (type: string, message?: string, item?: string, action?: string, cb?: Function) => {
    notification[type]({
        message: type === 'success' ? 'Thông báo' : 'Error',
        description: type === 'success' ? `${item} đã được ${action}  thành công.` : message
    })
    //callback triggerđac
    if (cb) cb()
}
