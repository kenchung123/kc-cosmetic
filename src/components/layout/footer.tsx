import React from 'react'
import footerQr from '../../static/layout/images/footer_qr.png'
import appStore from '../../static/layout/images/footer_app_store.png'
import ggPlay from '../../static/layout/images/footer-gg-play.png'
const AppFooter = () => {
    return (
        <footer className='footer'>
            <div className='footer__inner'>
                <div className='grid wide'>
                    <div className='row'>
                        <div className='col l-2-4 m-4 c-6'>
                            <div className='footer__item'>
                                <div className='footer__menu-title'>Chăm sóc khách hàng</div>
                                <ul className='footer__menu-list'>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Trung tâm trợ giúp</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Phản hồi khách hàng</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Hướng dẫn mua hàng</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Trả hàng &amp; Hoàn tiền</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Thanh toán</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='col l-2-4 m-4 c-6'>
                            <div className='footer__item'>
                                <div className='footer__menu-title'>Về chúng tôi</div>
                                <ul className='footer__menu-list'>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Giới thiệu về shopee Việt Nam</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Tuyển dụng</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Điều khoản shop</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Kênh Người bán</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Flash Sales</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='col l-2-4 m-4 c-6'>
                            <div className='footer__item'>
                                <div className='footer__menu-title'>Làm đẹp và chăm sóc da</div>
                                <ul className='footer__menu-list'>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>kem dưỡng ẩm | phấn nước</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Son &amp; kem</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Nước tẩy trang</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>serum trị mụn</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Nước hoa hồng</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='col l-2-4 m-4 c-6'>
                            <div className='footer__item'>
                                <div className='footer__menu-title'>Làm đẹp và chăm sóc da</div>
                                <ul className='footer__menu-list'>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>kem dưỡng ẩm | phấn nước</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Son &amp; kem</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Nước tẩy trang</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>serum trị mụn</a>
                                    </li>
                                    <li className='footer__menu-item'>
                                        <a className='footer__menu-link'>Nước hoa hồng</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='col l-2-4 m-4 c-6 hide-on-mobile'>
                            <div className='footer__item'>
                                <div className='footer__menu-title'>Vào cửa hàng trên ứng dụng</div>
                                <div className='footer__store'>
                                    <a className='footer__store-link'>
                                        <img src={footerQr} className='footer__store-link-qr' />
                                        <div className='footer__store-link-item'>
                                            <img src={appStore} className='footer__store-link-app' />
                                            <img src={ggPlay} className='footer__store-link-app' />
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='footer__policy'>
                    <div className='footer__policy-list'>
                        <div className='footer__policy-item'>
                            <a className='footer__policy-link'>Chính sách bảo mật</a>
                        </div>
                        <div className='footer__policy-item'>
                            <a className='footer__policy-link'>Quy chế hoạt động</a>
                        </div>
                        <div className='footer__policy-item'>
                            <a className='footer__policy-link'>Chính sách vận chuyển</a>
                        </div>
                        <div className='footer__policy-item'>
                            <a className='footer__policy-link'>Chính sách trả hàng và hoàn tiền</a>
                        </div>
                    </div>
                    <div className='footer__image-item'>
                        <a className='footer__image-link'>
                            <div className='footer__image' />
                        </a>
                    </div>
                    <div className='footer__copy-right'>
                        <i className='fal fa-copyright' /> 2020 KC cosmetics - LG Vina - 63 Lê Văn Lương, Trung Hòa, Cầu
                        Giấy, Hà Nội
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default AppFooter
