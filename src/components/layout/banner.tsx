import React from 'react'
import Slider from 'react-slick'
import banner1 from '../static/layout/images/slider1.jpg'
import banner2 from '../static/layout/images/slider2.jpg'
import banner3 from '../static/layout/images/slider3.jpg'
import banner4 from '../static/layout/images/slider4.jpg'
import banner5 from '../static/layout/images/slider5.jpg'
const Banner = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    }
    return (
        <Slider {...settings} className='slide-banner'>
            <div>
                <img src={banner1} />
            </div>
            <div>
                <img src={banner2} />
            </div>
            <div>
                <img src={banner3} />
            </div>
            <div>
                <img src={banner4} />
            </div>
            <div>
                <img src={banner5} />
            </div>
        </Slider>
    )
}

export default Banner
